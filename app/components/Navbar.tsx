"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Evita descalces de hidratación entre SSR y Client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-widest text-white">
            DATA<span className="text-cyan-400">WAVE</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/productos" className="text-sm text-zinc-400 hover:text-white transition">
              Catálogo
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2"
            >
              <span>Carrito</span>
              {mounted && totalItems > 0 && (
                <span className="bg-cyan-400 text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
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