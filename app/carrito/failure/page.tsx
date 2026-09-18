"use client";

import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">El pago no se pudo procesar</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Podés intentar de nuevo o elegir otro método de pago. Tu carrito sigue guardado.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/carrito"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition"
          >
            Volver al carrito
          </Link>
          <Link
            href="/productos"
            className="w-full text-zinc-400 hover:text-white text-sm py-2 transition"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}