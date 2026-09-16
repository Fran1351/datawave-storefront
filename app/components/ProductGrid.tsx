"use client";

import Image from "next/image";
import { Product } from "@/app/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-transparent hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:-translate-y-1"
        >
          {/* Borde-gradiente neón que aparece en hover */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-cyan-400 -z-10" />

          {/* Esquinas estilo HUD */}
          <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-500/0 group-hover:border-cyan-400 transition-colors duration-300 rounded-tl-sm" />
          <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500/0 group-hover:border-fuchsia-400 transition-colors duration-300 rounded-tr-sm" />
          <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500/0 group-hover:border-fuchsia-400 transition-colors duration-300 rounded-bl-sm" />
          <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-500/0 group-hover:border-cyan-400 transition-colors duration-300 rounded-br-sm" />

          {/* Contenedor de la imagen con proporción 3:4 */}
          <div className="relative w-full aspect-[3/4] mb-5 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/60 flex items-center justify-center p-4">
            {/* Scanlines sutiles */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(6,182,212,0.4) 0px, transparent 1px, transparent 3px)",
              }}
            />
            <Image
              src={product.image}
              alt={product.name || product.title || "Producto"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {product.category && (
              <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider z-20">
                {product.category}
              </span>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-2 mb-6">
            <h3 className="font-bold text-white text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
              {product.name || product.title}
            </h3>
            <p className="text-xl font-extrabold text-white font-mono tracking-tight group-hover:text-cyan-300 group-hover:[text-shadow:0_0_12px_rgba(34,211,238,0.8)] transition-all duration-300">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Botón de acción */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-zinc-800 hover:bg-cyan-500 text-white hover:text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] active:scale-95 group/btn"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Añadir al carrito</span>
          </button>
        </div>
      ))}
    </div>
  );
}