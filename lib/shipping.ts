// Cálculo simplificado de envío por zona según Código Postal.
// Estos montos son estimados — reemplazalos por las tarifas reales
// de Correo Argentino que tengas cargadas en tu cuenta.

export interface ShippingZone {
  name: string;
  cost: number;
}

interface ZoneRule {
  test: (cp: number) => boolean;
  zone: ShippingZone;
}

const ZONES: ZoneRule[] = [
  { test: (cp) => cp >= 1000 && cp <= 1499, zone: { name: "CABA", cost: 3500 } },
  { test: (cp) => cp >= 1500 && cp <= 1999, zone: { name: "GBA", cost: 4500 } },
  { test: (cp) => cp >= 2000 && cp <= 5999, zone: { name: "Centro del país", cost: 6000 } },
  { test: (cp) => cp >= 6000 && cp <= 7999, zone: { name: "Cuyo / NOA", cost: 7000 } },
  { test: (cp) => cp >= 8000 && cp <= 9999, zone: { name: "Patagonia", cost: 9000 } },
];

/**
 * Recibe un código postal (acepta formato CPA como "C1000" o numérico "1000")
 * y devuelve la zona y el costo estimado de envío, o null si no es válido.
 */
export function getShippingQuote(zipRaw: string): ShippingZone | null {
  const digits = zipRaw.replace(/\D/g, "");
  if (digits.length < 4) return null;

  const cp = parseInt(digits.slice(0, 4), 10);
  if (isNaN(cp)) return null;

  const match = ZONES.find((z) => z.test(cp));
  return match ? match.zone : null;
}