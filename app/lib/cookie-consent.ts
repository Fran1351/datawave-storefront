const STORAGE_KEY = "datawave-cookie-consent";

export type CookieConsentValue = "accepted" | "rejected";

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setCookieConsent(value: CookieConsentValue) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: value }));
}

export function clearCookieConsent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Usar esto antes de cargar cualquier script de analítica (Google Analytics,
 * Meta Pixel, etc.) el día que se agregue uno: solo debe correr si esto
 * devuelve true.
 */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "accepted";
}