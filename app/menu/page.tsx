"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();

  return (
    <main className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Fondo con click para cerrar */}
      <div 
        className="absolute inset-0" 
        onClick={() => router.back()} 
        aria-label="Cerrar menú"
      />

      {/* Panel lateral */}
      <div
        className="
          fixed
          inset-y-0
          right-0
          w-[85%]
          max-w-sm
          bg-zinc-950
          border-l
          border-zinc-800
          p-6
          pt-12
          shadow-2xl
          flex
          flex-col
          justify-between
          animate-slide-in
        "
      >
        <div>
          {/* BOTÓN CERRAR */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl text-zinc-400 hover:text-white transition"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <p className="text-zinc-500 uppercase tracking-[0.25em] text-xs mb-4">
            Navegación
          </p>

          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-2xl font-semibold px-5 py-4 rounded-2xl bg-zinc-900 active:bg-zinc-800 hover:text-zinc-300 transition"
            >
              Inicio
            </Link>

            <Link
              href="/productos"
              className="text-2xl font-semibold px-5 py-4 rounded-2xl bg-zinc-900 active:bg-zinc-800 hover:text-zinc-300 transition"
            >
              Productos
            </Link>

            <Link
              href="/carrito"
              className="text-2xl font-semibold px-5 py-4 rounded-2xl bg-zinc-900 active:bg-zinc-800 hover:text-zinc-300 transition"
            >
              Carrito
            </Link>
          </nav>
        </div>

        <div className="pb-6">
          <p className="text-zinc-600 text-sm">
            DataWave — Tecnología que mejora tu día.
          </p>
        </div>
      </div>
    </main>
  );
}