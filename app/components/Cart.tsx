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
      className="inline-flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
    >
      <svg
        className="w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
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
      <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono text-[10px]">
        {totalItems}
      </span>
    </Link>
  );
}