"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "@/app/components/CartDrawer";

const NAV_LINKS = [
  { href: "/productos", label: "Catálogo" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const { cart, updateQuantity, totalItems, isCartOpen, openCart, closeCart } = useCart();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Bloquea el scroll del body mientras el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* Altura fija: solo animamos fondo/blur, nunca el padding, para que nada salte */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-20 flex items-center transition-colors duration-300 ${
          scrolled || isMenuOpen
            ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl shadow-black/50"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo: marca geométrica propia, sin el ">" de terminal */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-sky-300 to-blue-600 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-zinc-950" />
            </span>
            <span className="text-xl font-black tracking-widest bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DATAWAVE
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-bold uppercase tracking-wider transition-colors py-1 group ${
                  isActive(link.href) ? "text-sky-400" : "text-zinc-300 hover:text-sky-400"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-sky-400 transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-3 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-sky-500/50 text-white px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] active:scale-95 group"
            >
              <svg
                className="w-5 h-5 text-sky-400 transition-transform duration-300 group-hover:scale-110"
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
                <span className="animate-pulse bg-sky-500 text-zinc-950 font-black px-2.5 py-0.5 rounded-full font-mono text-xs shadow-[0_0_12px_rgba(56,189,248,0.6)]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </nav>

          {/* Controles mobile: carrito destacado + hamburguesa discreta */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Carrito: es la acción principal, lleva el acento de color */}
            <button
              onClick={openCart}
              aria-label="Abrir carrito"
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-sky-300 to-blue-600 text-zinc-950 active:scale-95 transition shadow-[0_0_16px_rgba(56,189,248,0.35)]"
            >
              <svg
                className="w-5 h-5"
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
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-zinc-950 font-black w-5 h-5 flex items-center justify-center rounded-full font-mono text-[10px] shadow-md">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburguesa: secundaria, sin relleno de color */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              className="relative w-11 h-11 flex items-center justify-center rounded-full border border-zinc-700/80 text-zinc-300 active:scale-95 transition"
            >
              <span className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Panel del menú mobile */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-6 sm:px-8 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-bold uppercase tracking-wider py-3 border-b border-zinc-900 transition-colors ${
                  isActive(link.href) ? "text-sky-400" : "text-zinc-300 hover:text-sky-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Drawer desplegable conectado al contexto global */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cart}
        onUpdateQuantity={updateQuantity}
      />
    </>
  );
}