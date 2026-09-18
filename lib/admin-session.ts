export const COOKIE_NAME = "datawave_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 horas

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta ADMIN_SESSION_SECRET en las variables de entorno");
  }
  return secret;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bufferToBase64Url(signatureBuffer);
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = await sign(payload);
  if (signature !== expectedSignature) return false;

  const expiresAt = Number(payload);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}