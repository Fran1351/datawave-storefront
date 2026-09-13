"use client";

import { useCart } from "../context/CartContext";
import { Product } from "../types/product";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Evita la navegación si el botón está envuelto en un <Link>
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="relative group/btn overflow-hidden rounded-full bg-cyan-500/10 border border-cyan-500/30 px-5 py-2.5 text-xs font-bold text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500/10 disabled:hover:text-cyan-400 disabled:hover:shadow-none"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {product.stock > 0 ? "Añadir al Carrito" : "Agotado"}
      </span>
    </button>
  );
}