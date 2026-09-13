// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const preference = new Preference(client);
    const body = await request.json();

    const result = await preference.create({
      body: {
        items: body.items,
      },
    });

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la preferencia' }, { status: 500 });
  }
} 