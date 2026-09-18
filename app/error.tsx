"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Acá es donde en el futuro se podría mandar el error a una
    // herramienta de monitoreo (Sentry, etc.). Por ahora, a la consola.
    console.error("Error capturado por app/error.tsx:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-zinc-950 text-white px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-red-400 font-mono text-sm tracking-widest uppercase mb-4">
          Error inesperado
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Algo salió mal</h1>
        <p className="text-zinc-400 mb-10 leading-relaxed">
          Tuvimos un problema para mostrar esta página. Podés intentar de nuevo, o
          volver más tarde.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-cyan-500 text-black px-6 py-3 rounded-full font-bold hover:bg-cyan-400 transition"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-full font-bold hover:border-cyan-500/50 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}