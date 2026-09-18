"use client";

import { clearCookieConsent } from "@/app/lib/cookie-consent";

export default function ResetConsentButton() {
  const handleReset = () => {
    clearCookieConsent();
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition"
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}