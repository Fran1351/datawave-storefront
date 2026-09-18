import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createAdminClient } from "@/lib/supabase-admin";
import { randomUUID } from "crypto";
import { resend } from "@/lib/resend";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingProvince,
      shippingZip,
      shippingNotes,
      shippingCost = 0,
      shippingZone,
      paymentMethod = "mercadopago", // "mercadopago" | "transferencia" | "efectivo"
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No hay items en el carrito para procesar el pago." },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Faltan los datos del cliente." },
        { status: 400 }
      );
    }

    // El retiro en local (efectivo) no necesita dirección de envío
    if (paymentMethod !== "efectivo" && (!shippingAddress || !shippingCity)) {
      return NextResponse.json(
        { error: "Faltan los datos de envío." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const orderId = randomUUID();
    const itemsTotal = items.reduce(
      (acc: number, item: any) => acc + Number(item.unit_price) * Number(item.quantity),
      0
    );
    const totalAmount = itemsTotal + Number(shippingCost || 0);

    // 1. Descontamos el stock ANTES de crear el pedido, todo en una sola
    // transacción atómica (ver supabase-stock-functions.sql). Si algún
    // producto no tiene stock suficiente, no se crea el pedido.
    const { error: stockError } = await supabase.rpc("decrement_stock_for_order", {
      items: items.map((item: any) => ({
        id: String(item.id),
        quantity: Number(item.quantity),
      })),
    });

    if (stockError) {
      const insufficientMatch = stockError.message?.match(/insufficient_stock:(.+)/);
      if (insufficientMatch) {
        const failedId = insufficientMatch[1];
        const failedItem = items.find((item: any) => String(item.id) === failedId);
        const productLabel = failedItem?.title || failedItem?.name || "un producto";
        return NextResponse.json(
          { error: `No hay stock suficiente de "${productLabel}". Ajustá la cantidad en tu carrito.` },
          { status: 409 }
        );
      }

      console.error("Error al descontar stock:", stockError);
      return NextResponse.json(
        { error: "No se pudo verificar el stock. Intentá de nuevo." },
        { status: 500 }
      );
    }

    // 2. Creamos el pedido en estado PENDING
    const { error: orderError } = await supabase.from("Order").insert({
      id: orderId,
      customerEmail,
      customerName,
      customerPhone: customerPhone || null,
      shippingAddress: shippingAddress || null,
      shippingCity: shippingCity || null,
      shippingProvince: shippingProvince || null,
      shippingZip: shippingZip || null,
      shippingNotes: shippingNotes || null,
      paymentMethod,
      totalAmount,
      status: "PENDING",
      updatedAt: new Date().toISOString(),
    });

    if (orderError) {
      console.error("Error al crear el pedido:", orderError);
      // El stock ya se descontó, pero todavía no existen filas de OrderItem
      // (recién las vamos a crear después), así que devolvemos el stock
      // a partir del array de items original, no del pedido.
      await supabase
        .rpc("restore_stock_for_items", {
          items: items.map((item: any) => ({
            id: String(item.id),
            quantity: Number(item.quantity),
          })),
        })
        .match(() => {});
      return NextResponse.json(
        { error: "No se pudo registrar el pedido." },
        { status: 500 }
      );
    }

    // 3. Creamos los items del pedido
    const orderItems = items.map((item: any) => ({
      id: randomUUID(),
      orderId,
      productId: String(item.id),
      quantity: Number(item.quantity),
      price: Number(item.unit_price),
    }));

    const { error: itemsError } = await supabase.from("OrderItem").insert(orderItems);

    if (itemsError) {
      console.error("Error al crear los items del pedido:", itemsError);
      // El stock ya se descontó y el pedido ya se creó, pero OrderItem
      // falló: revertimos el stock a partir del array original (no de
      // OrderItem, que no llegó a crearse) y borramos el pedido huérfano.
      await supabase
        .rpc("restore_stock_for_items", {
          items: items.map((item: any) => ({
            id: String(item.id),
            quantity: Number(item.quantity),
          })),
        })
        .match(() => {});
      await supabase.from("Order").delete().eq("id", orderId).match(() => {});
      return NextResponse.json(
        { error: "No se pudieron registrar los productos del pedido." },
        { status: 500 }
      );
    }

    // 3. Mail de confirmación del pedido recibido (no implica pago aprobado)
    try {
      await resend.emails.send({
        from: "DataWave <onboarding@resend.dev>", // luego migrás a tu dominio
        to: customerEmail,
        subject: "Confirmamos tu pedido en DataWave",
        html: `
          <div style="font-family: sans-serif; background:#09090b; color:#fff; padding:24px; border-radius:16px;">
            <h1 style="color:#22d3ee;">¡Gracias por tu compra, ${customerName}!</h1>
            <p>Recibimos tu pedido y en breve vas a poder completar el pago.</p>
            <p style="color:#a1a1aa;">Número de pedido: <strong style="color:#fff;">${orderId}</strong></p>
            ${shippingAddress ? `<p style="color:#a1a1aa;">Dirección de entrega: ${shippingAddress}</p>` : ""}
            <p style="margin-top:16px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/seguimiento" style="color:#22d3ee;">
                Seguí el estado de tu pedido acá
              </a>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // No bloqueamos el checkout si falla el mail
      console.error("Error al enviar el mail de confirmación:", emailError);
    }

    // 4. Si es transferencia o efectivo, no pasamos por Mercado Pago
    if (paymentMethod === "transferencia" || paymentMethod === "efectivo") {
      return NextResponse.json({ success: true, orderId, paymentMethod });
    }

    // 5. Si es Mercado Pago, armamos la preferencia con el envío como ítem aparte
    const preference = new Preference(client);

    const mpItems = items.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.price ?? item.unit_price),
      currency_id: "ARS",
    }));

    if (Number(shippingCost) > 0) {
      mpItems.push({
        id: "envio",
        title: `Envío${shippingZone ? ` - ${shippingZone}` : ""} (Correo Argentino)`,
        quantity: 1,
        unit_price: Number(shippingCost),
        currency_id: "ARS",
      });
    }

    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/pending`,
        },
        auto_return: "approved",
        external_reference: orderId,
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/mercadopago`,
      },
    });

    return NextResponse.json({ id: result.id, init_point: result.init_point, orderId });
  } catch (error: any) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al procesar el pago" },
      { status: 500 }
    );
  }
}