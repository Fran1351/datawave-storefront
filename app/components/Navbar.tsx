"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "@/app/components/CartDrawer";

export default function Navbar() {
  const { cart, updateQuantity, totalItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-zinc-950/90 backdrop-blur-md py-4 border-b border-zinc-800/80 shadow-2xl shadow-black/50" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          
          {/* Logo más grande */}
          <Link href="/" className="group text-2xl font-black tracking-widest text-white flex items-center gap-2.5">
            <span className="text-cyan-400 font-mono transition-transform duration-300 group-hover:translate-x-1">&gt;</span> 
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DATAWAVE
            </span>
          </Link>

          {/* Opciones de Navegación y Carrito más espaciosas */}
          <div className="flex items-center gap-6 sm:gap-10">
            <Link 
              href="/productos" 
              className="relative text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-cyan-400 transition-colors py-1 group"
            >
              Catálogo
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative inline-flex items-center gap-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-cyan-500/50 text-white px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-95 group"
            >
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
              {mounted && totalItems > 0 && (
                <span className="animate-pulse bg-cyan-500 text-zinc-950 font-black px-2.5 py-0.5 rounded-full font-mono text-xs shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer desplegable conectado al contexto global */}
      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity} 
      />
    </>
  );
}