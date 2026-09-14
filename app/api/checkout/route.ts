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
        back_urls: {
          success: `${request.headers.get('origin')}/checkout/success`,
          failure: `${request.headers.get('origin')}/checkout/failure`,
          pending: `${request.headers.get('origin')}/checkout/pending`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error: any) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia', details: error.message }, 
      { status: 500 }
    );
  }
}