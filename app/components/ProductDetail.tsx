"use client";

import { useCart } from "../context/CartContext";

type ProductDetailProps = {
  id: number;
  name: string;
  price: string;
  image: string;
  stock?: number;
};

export default function ProductDetail({
  id,
  name,
  price,
  image,
  stock = 10,
}: ProductDetailProps) {
  const { addToCart } = useCart();

  return (
    <div className="mt-10 space-y-4">
      <button
        onClick={() =>
          addToCart({
            id,
            name,
            price,
            image,
            stock,
          })
        }
        className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-zinc-200 transition"
      >
        Agregar al carrito
      </button>

      <a
        href={`https://wa.me/5493572507831?text=${encodeURIComponent(
          `Hola, quiero comprar ${name}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full border border-zinc-700 py-4 rounded-full text-center font-semibold hover:bg-zinc-900 transition"
      >
        Comprar por WhatsApp
      </a>
    </div>
  );
}