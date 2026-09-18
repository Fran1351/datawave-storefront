import { Resend } from "resend";

let resendClient: Resend | null = null;
let warned = false;

/**
 * Devuelve el cliente de Resend, creándolo recién la primera vez que se
 * necesita (no al importar el archivo). Si falta RESEND_API_KEY, devuelve
 * null en vez de explotar — quien llame a esto debe chequear el null y
 * simplemente no mandar el mail, sin romper el resto del flujo.
 */
export function getResend(): Resend | null {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (!warned) {
      console.error(
        "RESEND_API_KEY no está configurada — no se van a poder enviar mails transaccionales."
      );
      warned = true;
    }
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}