"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/app/data/products";
import { Product } from "@/app/types/product";
import AddToCartButton from "@/app/components/AddToCartButton";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");

  const categories = useMemo(() => {
    const cats = (products as Product[])
      .map((p) => p.category)
      .filter((cat): cat is string => Boolean(cat));
    return ["TODOS", ...Array.from(new Set(cats))];
  }, []);

  const filteredProducts = useMemo(() => {
    return (products as Product[]).filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "TODOS" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-16 max-w-7xl mx-auto selection:bg-cyan-500 selection:text-black">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[160px] pointer-events-none -z-10 rounded-full" />

      <div className="mb-10 text-center md:text-left">
        <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
          CATÁLOGO EXCLUSIVO
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-1 tracking-tight">
          EQUIPAMIENTO DATAWAVE
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">
          Explorá nuestros componentes y periféricos de alto rendimiento diseñados para la máxima eficiencia.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-12 bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl backdrop-blur-xl">
        <div className="relative flex-1">
          <svg
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/80 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
          <p className="text-zinc-400 text-base font-medium">
            No se encontraron productos que coincidan con la búsqueda.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("TODOS");
            }}
            className="mt-4 text-xs font-mono text-cyan-400 underline hover:text-cyan-300"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-zinc-900/30 border border-zinc-800/80 hover:border-cyan-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              <div>
                <Link
                  href={`/productos/${product.id}`}
                  className="block relative aspect-square w-full bg-white rounded-2xl overflow-hidden p-6 mb-4"
                >
                  <Image
                    src={product.image || product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {product.category ?? "General"}
                </span>
                <Link href={`/productos/${product.id}`}>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block font-mono">PRECIO</span>
                  <span className="text-lg font-black text-white">
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                </div>

                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}