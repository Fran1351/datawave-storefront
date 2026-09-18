"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookieConsent, setCookieConsent } from "@/app/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo se muestra si el usuario todavía no aceptó ni rechazó
    setVisible(getCookieConsent() === null);
  }, []);

  const handleChoice = (value: "accepted" | "rejected") => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900 border-t border-zinc-800 px-6 py-5 md:px-10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-300 text-center md:text-left leading-relaxed">
          Usamos almacenamiento local para que tu carrito no se pierda, y (si lo aceptás)
          cookies de análisis para entender cómo se usa el sitio. Podés leer más en nuestra{" "}
          <Link href="/cookies" className="text-cyan-400 hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleChoice("rejected")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
          >
            Rechazar
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}