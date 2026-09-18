// Integración con la API real de Correo Argentino (MiCorreo).
// Documentación oficial: https://www.correoargentino.com.ar/MiCorreo/public/img/pag/apiMiCorreo.pdf
//
// Requiere 4 variables de entorno (pedidas a Correo Argentino, NO son tu
// login normal del portal):
//   CORREO_ARGENTINO_API_USER
//   CORREO_ARGENTINO_API_PASSWORD
//   CORREO_ARGENTINO_CUSTOMER_ID
//   CORREO_ARGENTINO_ORIGIN_ZIP     (código postal de tu local/depósito)
//
// Opcional: CORREO_ARGENTINO_ENV = "test" para usar el ambiente de pruebas
// (por defecto usa producción).

const ENV = process.env.CORREO_ARGENTINO_ENV === "test" ? "test" : "prod";
const BASE_URL =
  ENV === "test"
    ? "https://apitest.correoargentino.com.ar/micorreo/v1"
    : "https://api.correoargentino.com.ar/micorreo/v1";

const API_USER = process.env.CORREO_ARGENTINO_API_USER || "";
const API_PASSWORD = process.env.CORREO_ARGENTINO_API_PASSWORD || "";
const CUSTOMER_ID = process.env.CORREO_ARGENTINO_CUSTOMER_ID || "";
const ORIGIN_ZIP = process.env.CORREO_ARGENTINO_ORIGIN_ZIP || "";

// Paquete genérico usado para cotizar, ya que no tenemos peso/dimensiones
// por producto cargados en la base. Ajustable acá.
const DEFAULT_PACKAGE = {
  weight: 500, // gramos
  height: 10, // cm
  width: 20, // cm
  length: 20, // cm
};

let cachedToken: { token: string; expiresAt: number } | null = null;

/** true si están cargadas las 4 variables de entorno necesarias. */
export function isCorreoArgentinoConfigured(): boolean {
  return Boolean(API_USER && API_PASSWORD && CUSTOMER_ID && ORIGIN_ZIP);
}

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${API_USER}:${API_PASSWORD}`).toString("base64");
  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    throw new Error(`No se pudo autenticar con Correo Argentino (HTTP ${res.status})`);
  }

  const data = await res.json();
  const expiresAt = new Date(data.expires.replace(" ", "T")).getTime();

  cachedToken = {
    token: data.token,
    expiresAt: isNaN(expiresAt) ? Date.now() + 10 * 60_000 : expiresAt,
  };

  return cachedToken.token;
}

export interface CorreoArgentinoRate {
  price: number;
  productName: string;
  deliveredType: "D" | "S";
}

/**
 * Cotiza el envío a domicilio contra la API real de MiCorreo.
 * Devuelve null si la integración no está configurada, o si la consulta falla
 * (en ambos casos hay que usar el estimado por zona como respaldo).
 */
export async function getCorreoArgentinoRate(
  destinationZip: string
): Promise<CorreoArgentinoRate | null> {
  if (!isCorreoArgentinoConfigured()) return null;

  const digits = destinationZip.replace(/\D/g, "");
  if (digits.length < 4) return null;

  try {
    const token = await getToken();

    const res = await fetch(`${BASE_URL}/rates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: CUSTOMER_ID,
        postalCodeOrigin: ORIGIN_ZIP,
        postalCodeDestination: digits,
        deliveredType: "D", // entrega a domicilio (usar "S" para sucursal)
        dimensions: DEFAULT_PACKAGE,
      }),
    });

    if (!res.ok) {
      console.error("Correo Argentino /rates error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const rate = data.rates?.[0];
    if (!rate) return null;

    return {
      price: Number(rate.price),
      productName: rate.productName,
      deliveredType: rate.deliveredType,
    };
  } catch (error) {
    console.error("Error consultando Correo Argentino:", error);
    return null;
  }
}