import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: orders, error: ordersError } = await supabase
      .from("Order")
      .select("*")
      .order("updatedAt", { ascending: false });

    if (ordersError) {
      console.error("Error al traer pedidos:", ordersError);
      return NextResponse.json({ error: "No se pudieron obtener los pedidos" }, { status: 500 });
    }

    const orderIds = (orders ?? []).map((o) => o.id);

    const { data: items, error: itemsError } = await supabase
      .from("OrderItem")
      .select("*")
      .in("orderId", orderIds.length > 0 ? orderIds : ["__none__"]);

    if (itemsError) {
      console.error("Error al traer items de pedidos:", itemsError);
      return NextResponse.json({ error: "No se pudieron obtener los items" }, { status: 500 });
    }

    const ordersWithItems = (orders ?? []).map((order) => ({
      ...order,
      items: (items ?? []).filter((item) => item.orderId === order.id),
    }));

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error("Error inesperado al traer pedidos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Faltan orderId o status" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "PAID", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("Order")
      .update({ status, updatedAt: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      return NextResponse.json({ error: "No se pudo actualizar el pedido" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inesperado al actualizar pedido:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}