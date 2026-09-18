"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutPendingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("external_reference");

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Pago en proceso</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Tu pago está siendo revisado (por ejemplo, si pagaste con efectivo en un punto de pago).
          Te avisamos por email en cuanto se confirme.
        </p>

        {orderId && (
          <p className="text-zinc-500 text-xs font-mono mb-8 break-all">
            Pedido: {orderId}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/seguimiento"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition"
          >
            Ver estado del pedido
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