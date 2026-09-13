"use client";

import { useState } from "react";
import { Product } from "@/app/types/product";
import { useCart } from "@/app/context/CartContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasStock = product.stock === undefined || product.stock > 0;
  const maxStock = product.stock ?? 99;

  const handleAddToCart = () => {
    if (!hasStock) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Selector de cantidad */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400">Cantidad:</span>
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || !hasStock}
            className="px-4 py-2 text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:text-zinc-400"
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="px-4 font-bold text-sm w-10 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
            disabled={quantity >= maxStock || !hasStock}
            className="px-4 py-2 text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:text-zinc-400"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* Botón de acción */}
      <button
        onClick={handleAddToCart}
        disabled={!hasStock}
        className={`w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed ${
          added
            ? "bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            : "bg-white text-black hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        }`}
      >
        {added ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            ¡Agregado al carrito!
          </>
        ) : !hasStock ? (
          "Sin Stock Disponible"
        ) : (
          `Agregar al carrito (${quantity})`
        )}
      </button>
    </div>
  );
}