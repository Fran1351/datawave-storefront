"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export interface ProductProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

export default function ProductCard({
  id,
  name,
  description = "",
  price,
  image,
  category = "General",
  stock = 0,
}: ProductProps) {
  const { addToCart } = useCart();
  const [currentStock, setCurrentStock] = useState(stock);

  useEffect(() => {
    function updateStock() {
      const savedStock = localStorage.getItem("datawave-stock");

      if (!savedStock) return;

      const stocks = JSON.parse(savedStock);

      if (stocks[id] !== undefined) {
        setCurrentStock(stocks[id]);
      }
    }

    updateStock();

    window.addEventListener("storage", updateStock);
    window.addEventListener("stockUpdated", updateStock);

    return () => {
      window.removeEventListener("storage", updateStock);
      window.removeEventListener("stockUpdated", updateStock);
    };
  }, [id, stock]);

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between group">
      <div className="relative w-full h-64 bg-zinc-900/50 p-5 overflow-hidden border-b border-zinc-900">
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          className="object-contain p-5 transition-transform duration-700 group-hover:scale-110"
        />
        {/* Badge de categoría opcional */}
        <div className="absolute top-3 left-3">
          <span className="bg-zinc-900/80 backdrop-blur-md text-zinc-400 border border-zinc-800 text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/productos/${id}`}>
            <h2 className="text-base font-bold text-white hover:text-cyan-400 transition line-clamp-1">
              {name}
            </h2>
          </Link>

          <p className="text-xl font-black text-cyan-400 mt-2 font-mono">
            ${price.toLocaleString("es-AR")}
          </p>

          <p className="text-xs font-mono text-zinc-500 mt-2">
            {currentStock > 0 ? `${currentStock} disponibles en stock` : "Sin stock disponible"}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            disabled={currentStock === 0}
            onClick={() =>
              addToCart({
                id: String(id),
                name,
                description,
                price,
                image,
                category,
                stock: currentStock,
              })
            }
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold py-3 rounded-full text-xs transition shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {currentStock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>

          <a
            href={`https://wa.me/5493572507831?text=Hola,%20quiero%20comprar%20${encodeURIComponent(
              name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 py-3 rounded-full text-center text-xs font-bold transition"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}