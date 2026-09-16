"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState } from "react";

export default function Cart() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  if (!mounted) {
    return null;
  }

  return (
    <Link
      href="/carrito"
      className="group relative inline-flex items-center gap-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-transparent text-white px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-95"
    >
      {/* Borde-gradiente neón en hover, igual que ProductCard */}
      <div className="pointer-events-none absolute inset-0 rounded-full p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 -z-10" />

      {/* Esquinas HUD, sutiles, solo arriba para no saturar un botón chico */}
      <span className="absolute top-0 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-500/0 group-hover:border-cyan-400 transition-colors duration-300 rounded-tl-sm" />
      <span className="absolute top-0 right-2 w-2 h-2 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-400 transition-colors duration-300 rounded-tr-sm" />

      <svg
        className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      <span>Carrito</span>

      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[22px] h-[22px] px-1 bg-cyan-500 text-zinc-950 font-black rounded-full font-mono text-[11px] shadow-[0_0_12px_rgba(6,182,212,0.7)] ring-2 ring-zinc-950">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}