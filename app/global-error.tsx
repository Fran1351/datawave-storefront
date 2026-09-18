"use client";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-zinc-950 text-white min-h-screen flex items-center justify-center px-6 antialiased">
        <div className="max-w-md text-center py-24">
          <p className="text-red-400 font-mono text-sm tracking-widest uppercase mb-4">
            Error crítico
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Algo salió muy mal</h1>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            Hubo un problema grave al cargar el sitio. Probá recargar la página o
            volvé más tarde.
          </p>
          <button
            onClick={reset}
            className="bg-cyan-500 text-black px-6 py-3 rounded-full font-bold hover:bg-cyan-400 transition"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}