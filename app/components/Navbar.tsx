"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "@/app/components/CartDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-widest text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono">&gt;</span> DATAWAVE
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/productos" className="text-xs font-bold text-zinc-400 hover:text-white transition">
              Catálogo
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
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
              {mounted && totalItems > 0 && (
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono text-[10px]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer desplegable */}
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}