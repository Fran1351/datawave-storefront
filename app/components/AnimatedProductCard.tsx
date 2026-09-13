"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/product";

export default function AnimatedProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 rounded-3xl p-5 flex flex-col justify-between"
    >
      <div>
        <Link href={`/productos/${product.id}`}>
          <div className="bg-white rounded-2xl relative aspect-square overflow-hidden">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition duration-500"
            />
          </div>
        </Link>
        <div className="mt-5">
          <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-xl font-bold mt-1">{product.name}</h3>
          <p className="text-cyan-400 font-bold mt-2">{product.price}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-white hover:bg-cyan-300 text-black font-bold py-3 rounded-full text-sm transition"
        >
          Añadir al Carrito
        </button>
      </div>
    </motion.div>
  );
}