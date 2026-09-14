"use client";

import { useCart } from "@/app/context/CartContext";

type ProductDetailProps = {
  id: number | string;
  name: string;
  price: number | string;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
};

export default function ProductDetail({
  id,
  name,
  price,
  image,
  description = "",
  category = "General",
  stock = 10,
}: ProductDetailProps) {
  const { addToCart } = useCart();

  const numericPrice =
    typeof price === "number"
      ? price
      : parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;

  return (
    <div className="mt-10 space-y-4">
      <button
        onClick={() =>
          addToCart({
            id,
            name,
            description,
            price: numericPrice,
            image,
            category,
            stock,
          })
        }
        className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold py-4 rounded-full text-sm transition shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
      >
        Agregar al carrito
      </button>

      <a
        href={`https://wa.me/5493572507831?text=${encodeURIComponent(
          `Hola, quiero comprar ${name}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 py-4 rounded-full text-center text-xs font-bold transition"
      >
        Comprar por WhatsApp
      </a>
    </div>
  );
}