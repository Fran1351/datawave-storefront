import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: Number(item.numericPrice),
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/status/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/status/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/status/pending`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    console.error("Error al crear preferencia de Mercado Pago:", error);
    return NextResponse.json({ error: "Error en el pago" }, { status: 500 });
  }
}