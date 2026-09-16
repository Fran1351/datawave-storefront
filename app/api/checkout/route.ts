import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No hay items en el carrito para procesar el pago." },
        { status: 400 }
      );
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.title || item.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/pending`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error: any) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al procesar el pago" },
      { status: 500 }
    );
  }
}