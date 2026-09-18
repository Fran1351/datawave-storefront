import { NextResponse } from "next/server";
import { getCorreoArgentinoRate, isCorreoArgentinoConfigured } from "@/lib/correoArgentino";
import { getShippingQuote } from "@/lib/shipping";

export async function POST(request: Request) {
  try {
    const { zip } = await request.json();

    if (!zip || typeof zip !== "string") {
      return NextResponse.json({ error: "Falta el código postal." }, { status: 400 });
    }

    // 1. Si está configurada la API real de Correo Argentino, la consultamos primero
    if (isCorreoArgentinoConfigured()) {
      const rate = await getCorreoArgentinoRate(zip);
      if (rate) {
        return NextResponse.json({
          cost: Math.round(rate.price),
          zone: rate.productName,
          source: "correoargentino",
        });
      }
      // Si la consulta real falla (CP inválido para la API, error de red, etc.)
      // caemos al estimado por zona como respaldo, en vez de romper el checkout.
    }

    // 2. Estimado por zona (mientras no esté configurada la API real, o como respaldo)
    const estimate = getShippingQuote(zip);
    if (!estimate) {
      return NextResponse.json({ error: "Código postal no reconocido." }, { status: 404 });
    }

    return NextResponse.json({
      cost: estimate.cost,
      zone: estimate.name,
      source: "estimado",
    });
  } catch (error: any) {
    console.error("Error al cotizar el envío:", error);
    return NextResponse.json({ error: "Error al calcular el envío." }, { status: 500 });
  }
}