import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createAdminClient } from "@/lib/supabase-admin";
import { getResend } from "@/lib/resend";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

function mapStatus(mpStatus: string): "PENDING" | "PAID" | "CANCELLED" {
  if (mpStatus === "approved") return "PAID";
  if (mpStatus === "rejected" || mpStatus === "cancelled") return "CANCELLED";
  return "PENDING";
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let paymentId = searchParams.get("data.id") || searchParams.get("id");

    if (!paymentId) {
      const body = await request.json().catch(() => null);
      paymentId = body?.data?.id || null;
    }

    if (!paymentId) {
      // Mercado Pago manda otros tipos de notificación que no nos interesan
      return NextResponse.json({ received: true });
    }

    // Consultamos el pago directo a la API de Mercado Pago (nunca confiar
    // en el body de la notificación por sí solo, puede ser falsificado)
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    const orderId = paymentInfo.external_reference;
    const mpStatus = paymentInfo.status;

    if (!orderId || !mpStatus) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();
    const newStatus = mapStatus(mpStatus);

    // Traemos el pedido ANTES de actualizar, para saber su estado previo
    // (evita reenviar el mail si el webhook llega duplicado)
    const { data: existingOrder, error: fetchError } = await supabase
      .from("Order")
      .select("status, customerEmail, customerName, totalAmount")
      .eq("id", orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.error("No se encontró el pedido para el webhook:", fetchError);
      return NextResponse.json({ received: true });
    }

    const wasAlreadyPaid = existingOrder.status === "PAID";
    const wasAlreadyCancelled = existingOrder.status === "CANCELLED";

    const { error } = await supabase
      .from("Order")
      .update({
        status: newStatus,
        paymentId: String(paymentId),
        updatedAt: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error al actualizar el pedido desde el webhook:", error);
      return NextResponse.json({ error: "Error al actualizar el pedido" }, { status: 500 });
    }

    // Devolvemos el stock la primera vez que el pedido pasa a CANCELLED
    // (pago rechazado o cancelado en Mercado Pago) — el stock se había
    // descontado en el checkout, así que si el pago no se concreta hay
    // que liberarlo de nuevo.
    if (newStatus === "CANCELLED" && !wasAlreadyCancelled) {
      const { error: restoreError } = await supabase.rpc("restore_stock_for_order", {
        order_id_input: orderId,
      });
      if (restoreError) {
        // No bloqueamos el webhook por esto, pero lo dejamos loggeado
        // para revisar el stock manualmente si hace falta.
        console.error("Error al restaurar stock desde el webhook:", restoreError);
      }
    }

    // Mail de "pago confirmado", solo la primera vez que pasa a PAID
    const resend = getResend();
    if (newStatus === "PAID" && !wasAlreadyPaid && existingOrder.customerEmail && resend) {
      try {
        await resend.emails.send({
          from: "DataWave <onboarding@resend.dev>", // luego migrás a tu dominio
          to: existingOrder.customerEmail,
          subject: "¡Tu pago fue confirmado! - DataWave",
          html: `
            <div style="font-family: sans-serif; background:#09090b; color:#fff; padding:24px; border-radius:16px;">
              <h1 style="color:#22d3ee;">¡Gracias por tu compra, ${existingOrder.customerName}!</h1>
              <p>Confirmamos que tu pago fue aprobado. Ya estamos preparando tu pedido.</p>
              <p style="color:#a1a1aa;">Número de pedido: <strong style="color:#fff;">${orderId}</strong></p>
              <p style="color:#a1a1aa;">Total pagado: ${new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
              }).format(Number(existingOrder.totalAmount))}</p>
              <p style="margin-top:16px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/seguimiento" style="color:#22d3ee;">
                  Seguí el estado de tu pedido acá
                </a>
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        // No bloqueamos el webhook si falla el mail — Mercado Pago espera 200 igual
        console.error("Error al enviar el mail de pago confirmado:", emailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error en el webhook de Mercado Pago:", error);
    // Devolvemos 200 igual para que Mercado Pago no reintente infinitamente
    // por errores que no se van a resolver solos
    return NextResponse.json({ received: true });
  }
}