// app/components/ProductCardClient.tsx
"use client";

import { useCart } from "@/app/context/CartContext";
import { Product } from "@/app/types/product";

export default function ProductCardClient({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] text-xs tracking-wider uppercase"
    >
      Añadir al carrito
    </button>
  );
}