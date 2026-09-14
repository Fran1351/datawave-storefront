"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/product";
import AddToCartButton from "@/app/components/AddToCartButton";

export default function AnimatedProductCard({
  product,
}: {
  product: Product;
  onAddToCart?: (p: Product) => void;
}) {
  const displayPrice = typeof product.price === "number" 
    ? `$${product.price.toLocaleString("es-AR")}` 
    : product.price;

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
              src={product.image || product.imageUrl || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition duration-500"
            />
          </div>
        </Link>
        <div className="mt-5">
         <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
  {typeof product.category === 'object' && product.category !== null
    ? (product.category as { name: string }).name
    : String(product.category || '')}
</span>
          <h3 className="text-xl font-bold mt-1 text-white">{product.name}</h3>
          <p className="text-cyan-400 font-bold mt-2">{displayPrice}</p>
        </div>
      </div>

      <div className="mt-6">
        <AddToCartButton product={product} />
      </div>
    </motion.div>
  );
}