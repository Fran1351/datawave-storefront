"use client";

import { useState } from "react";
import { Product } from "@/app/types/product";
import { useCart } from "@/app/context/CartContext";
import { usePricing } from "@/app/hooks/usePricing";
import { useStock } from "@/app/hooks/useStock";
import { formatPrice } from "@/lib/utils";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { finalPrice, hasPromo } = usePricing(Number(product.id), Number(product.price));
  const { stock, hasStock } = useStock(Number(product.id), Number(product.stock ?? 0));
  const maxStock = stock || 1;

  const productName = product.name || "este producto";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    hasStock
      ? `Hola! Estoy interesado/a en "${productName}" (${formatPrice(finalPrice)}). ¿Me pasás más info?`
      : `Hola! Quería consultar por "${productName}", vi que está sin stock. ¿Cuándo tendrían disponible?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleAddToCart = () => {
    if (!hasStock) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, price: finalPrice });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Precio */}
      <div>
        {hasPromo && hasStock ? (
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-emerald-400 font-mono">{formatPrice(finalPrice)}</p>
            <p className="text-lg text-zinc-500 font-mono line-through">{formatPrice(Number(product.price))}</p>
          </div>
        ) : (
          <p className="text-3xl font-bold text-white font-mono">{formatPrice(finalPrice)}</p>
        )}
      </div>

      {/* Selector de cantidad */}
      {hasStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Cantidad:</span>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-4 py-2 text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:text-zinc-400"
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="px-4 font-bold text-sm w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              disabled={quantity >= maxStock}
              className="px-4 py-2 text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:text-zinc-400"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Botón de acción */}
      {hasStock ? (
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 ${
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
          ) : (
            `Agregar al carrito (${quantity})`
          )}
        </button>
      ) : (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
          </svg>
          Contactar por WhatsApp
        </a>
      )}
    </div>
  );
}