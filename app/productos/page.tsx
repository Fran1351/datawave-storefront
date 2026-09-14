"use client";

import Navbar from "../components/Navbar";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useState } from "react";

export default function Productos() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  // CATEGORÍAS AUTOMÁTICAS
  const categories = [
    "Todos",
    ...Array.from(
      new Set(products.map((product) => product.category))
    ),
  ];

  // FILTRADO
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "Todos" ||
      product.category === category;

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* ENCABEZADO */}
      <section className="px-8 md:px-20 pt-36 pb-10">
        <div className="max-w-6xl mx-auto">

          <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm font-semibold">
            DataWave
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-4">
            Productos
          </h1>

          <p className="text-zinc-400 text-lg mt-5 max-w-xl">
            Tecnología, accesorios y productos seleccionados
            para mejorar tu día.
          </p>

        </div>
      </section>

      {/* BUSCADOR */}
      <section className="px-8 md:px-20 pb-8">
        <div className="max-w-6xl mx-auto">

          <div className="relative max-w-2xl">

            {/* LUPA */}
            <div
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                pointer-events-none
              "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="white"
                  strokeWidth="2"
                />

                <path
                  d="M16 16L21 21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-zinc-900
                border
                border-zinc-700
                rounded-2xl
                py-4
                pl-14
                pr-14
                text-white
                placeholder:text-zinc-600
                outline-none
                focus:border-zinc-500
                transition
              "
            />

            {/* LIMPIAR */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  w-8
                  h-8
                  rounded-full
                  bg-zinc-800
                  text-zinc-400
                  hover:text-white
                  hover:bg-zinc-700
                  transition
                "
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}

          </div>

        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="px-8 md:px-20 pb-12">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-wrap gap-3">

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={
                  category === cat
                    ? `
                      bg-white
                      text-black
                      px-6
                      py-3
                      rounded-full
                      font-semibold
                      transition
                    `
                    : `
                      bg-zinc-900
                      text-zinc-400
                      border
                      border-zinc-800
                      px-6
                      py-3
                      rounded-full
                      hover:text-white
                      hover:border-zinc-600
                      transition
                    `
                }
              >
                {cat}
              </button>
            ))}

          </div>

        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="px-8 md:px-20 pb-24">
        <div className="max-w-6xl mx-auto">

          {/* CONTADOR */}
          <div className="flex justify-between items-center mb-8">

            <p className="text-zinc-500 text-sm">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto"
                : "productos"}
            </p>

            <p className="text-zinc-600 text-sm">
              {category}
            </p>

          </div>

          {/* RESULTADOS */}
          {filteredProducts.length > 0 ? (

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={Number(product.id)}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image}
                  stock={Number(product.stock)}
                />
              ))}

            </div>

          ) : (

            /* SIN RESULTADOS */
            <div className="text-center py-24">

              <div className="flex justify-center mb-6">

                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="rgb(82 82 91)"
                    strokeWidth="2"
                  />

                  <path
                    d="M16 16L21 21"
                    stroke="rgb(82 82 91)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

              </div>

              <h2 className="text-2xl font-bold">
                No encontramos productos
              </h2>

              <p className="text-zinc-500 mt-3">
                Probá con otro nombre o categoría.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("Todos");
                }}
                className="
                  mt-6
                  bg-white
                  text-black
                  px-6
                  py-3
                  rounded-full
                  font-semibold
                  hover:bg-zinc-200
                  transition
                "
              >
                Ver todos los productos
              </button>

            </div>

          )}

        </div>
      </section>
    </main>
  );
}