// app/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/product";
import { formatPrice } from "@/lib/utils";
import { usePricing } from "@/app/hooks/usePricing";
import { useStock } from "@/app/hooks/useStock";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { slugify } from "@/app/lib/slugify";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const productName = product.name || product.title || "este producto";
  const productSlug = slugify(productName);
  const { finalPrice, hasPromo } = usePricing(Number(product.id), Number(product.price));
  const { hasStock } = useStock(Number(product.id), Number(product.stock ?? 0));
  const { openCart } = useCart();
  const { showToast } = useToast();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    hasStock
      ? `Hola! Estoy interesado/a en "${productName}" (${formatPrice(finalPrice)}). ¿Me pasás más info?`
      : `Hola! Quería consultar por "${productName}", vi que está sin stock. ¿Cuándo tendrían disponible?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="group relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-transparent hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:-translate-y-1">
      {/* Borde-gradiente neón en hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-400 -z-10" />

      {/* Esquinas estilo HUD */}
      <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-500/0 group-hover:border-cyan-400 transition-colors duration-300 rounded-tl-sm z-20" />
      <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-400 transition-colors duration-300 rounded-tr-sm z-20" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-400 transition-colors duration-300 rounded-bl-sm z-20" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-500/0 group-hover:border-cyan-400 transition-colors duration-300 rounded-br-sm z-20" />

      {/* Badge de promoción o sin stock */}
      {!hasStock ? (
        <span className="absolute top-4 left-4 bg-zinc-800 text-zinc-400 font-black px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider z-20 border border-zinc-700">
          Sin stock
        </span>
      ) : (
        hasPromo && (
          <span className="absolute top-4 left-4 bg-emerald-500 text-zinc-950 font-black px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider z-20 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
            Oferta
          </span>
        )
      )}

      {/* Enlace que envuelve la imagen y el texto para ir al detalle */}
      <Link href={`/productos/${productSlug}`} className="block">
        <div className={`relative w-full aspect-[3/4] mb-5 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/60 flex items-center justify-center p-4 ${!hasStock ? "opacity-50" : ""}`}>
          {/* Scanlines sutiles */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(6,182,212,0.4) 0px, transparent 1px, transparent 3px)",
            }}
          />
          <Image
            src={product.image || "/placeholder.png"}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-white text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {productName}
          </h3>
          {hasPromo && hasStock ? (
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-extrabold text-emerald-400 font-mono tracking-tight group-hover:[text-shadow:0_0_12px_rgba(16,185,129,0.8)] transition-all duration-300">
                {formatPrice(finalPrice)}
              </p>
              <p className="text-sm text-zinc-500 font-mono line-through">
                {formatPrice(Number(product.price))}
              </p>
            </div>
          ) : (
            <p className="text-xl font-extrabold text-white font-mono tracking-tight group-hover:text-cyan-300 group-hover:[text-shadow:0_0_12px_rgba(34,211,238,0.8)] transition-all duration-300">
              {formatPrice(finalPrice)}
            </p>
          )}
        </div>
      </Link>

      {/* Botones de acción */}
      <div className="mt-6 flex gap-2">
        {hasStock ? (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart({ ...product, price: finalPrice });
                showToast(`${productName} agregado al carrito`);
                openCart();
              }}
              className="flex-1 bg-zinc-800 hover:bg-cyan-500 text-white hover:text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] active:scale-95"
            >
              Añadir al carrito
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Consultar por ${productName} en WhatsApp`}
              className="shrink-0 w-12 flex items-center justify-center bg-zinc-800 hover:bg-emerald-500 text-white hover:text-zinc-950 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
              </svg>
            </a>
          </>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}