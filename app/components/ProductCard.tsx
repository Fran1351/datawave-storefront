"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
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
    <div className="bg-zinc-900 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between">
      <div className="relative w-full h-64 bg-white p-5">
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          className="object-contain p-5 transition-transform duration-700 hover:scale-110"
        />
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/productos/${id}`}>
            <h2 className="text-xl font-bold hover:text-zinc-400 transition">
              {name}
            </h2>
          </Link>

          <p className="text-zinc-400 mt-2">
            ${price.toLocaleString("es-AR")}
          </p>

          <p className="text-sm text-zinc-500 mt-2">
            {currentStock > 0 ? `${currentStock} disponibles` : "Sin stock"}
          </p>
        </div>

        <div className="mt-5 space-y-3">
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
            className="w-full bg-zinc-800 text-white py-3 rounded-full hover:bg-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentStock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>

          <a
            href={`https://wa.me/5493572507831?text=Hola,%20quiero%20comprar%20${encodeURIComponent(
              name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white text-black py-3 rounded-full text-center font-semibold hover:bg-zinc-200 transition"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}