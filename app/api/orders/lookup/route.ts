import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { MOCK_PRODUCTS } from "@/app/data/products";

export async function POST(request: Request) {
  try {
    const { orderId, email } = await request.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Ingresá el número de pedido y el email." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from("Order")
      .select("*")
      .eq("id", orderId.trim())
      .single();

    // Mismo mensaje genérico si el pedido no existe, si el ID es inválido,
    // o si el email no coincide: así nadie puede confirmar si un pedido
    // existe probando emails al azar contra un ID real.
    if (error || !order || order.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "No encontramos un pedido con esos datos. Revisá el número de pedido y el email." },
        { status: 404 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("OrderItem")
      .select("*")
      .eq("orderId", order.id);

    if (itemsError) {
      console.error("Error al traer items del pedido:", itemsError);
      return NextResponse.json({ error: "Ocurrió un error al buscar el pedido." }, { status: 500 });
    }

    // Los items solo tienen productId, así que buscamos el nombre en MOCK_PRODUCTS
    const itemsWithNames = (items ?? []).map((item) => {
      const product = MOCK_PRODUCTS.find((p) => String(p.id) === String(item.productId));
      return { ...item, name: product?.name || "Producto" };
    });

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        customerName: order.customerName,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingProvince: order.shippingProvince,
        updatedAt: order.updatedAt,
        items: itemsWithNames,
      },
    });
  } catch (error) {
    console.error("Error inesperado en lookup de pedido:", error);
    return NextResponse.json({ error: "Ocurrió un error al buscar el pedido." }, { status: 500 });
  }
}