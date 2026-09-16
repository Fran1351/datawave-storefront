"use client";

import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { Product } from "@/app/types/product";
import { useEffect, useState } from "react";

interface AddToCartButtonProps {
  product: Product;
}

const STOCK_STORAGE_KEY = "datawave-stock";
const FEEDBACK_DURATION_MS = 1200;

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [currentStock, setCurrentStock] = useState<number>(product.stock ?? 0);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const updateStockFromStorage = () => {
      const savedStock = localStorage.getItem(STOCK_STORAGE_KEY);
      if (savedStock) {
        try {
          const parsedStock = JSON.parse(savedStock) as Record<string, number>;
          if (parsedStock[product.id] !== undefined) {
            setCurrentStock(Number(parsedStock[product.id]));
            return;
          }
        } catch (error) {
          console.error("Error leyendo stock local:", error);
        }
      }
      setCurrentStock(product.stock ?? 0);
    };

    updateStockFromStorage();

    window.addEventListener("stockUpdated", updateStockFromStorage);
    return () => {
      window.removeEventListener("stockUpdated", updateStockFromStorage);
    };
  }, [product.id, product.stock]);

  const hasStock = currentStock > 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasStock || justAdded) return;

    const success = addToCart({ ...product, stock: currentStock });

    if (!success) {
      showToast("No hay más stock disponible");
      return;
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), FEEDBACK_DURATION_MS);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!hasStock}
      className="relative group/btn overflow-hidden rounded-full bg-cyan-500/10 border border-cyan-500/30 px-5 py-2.5 text-xs font-bold text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500/10 disabled:hover:text-cyan-400 disabled:hover:shadow-none"
    >
      <span aria-live="polite" className="relative z-10 flex items-center justify-center gap-2">
        {justAdded ? (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Añadido
          </>
        ) : (
          <>
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
            {hasStock ? "Añadir al Carrito" : "Agotado"}
          </>
        )}
      </span>
    </button>
  );
}