"use client";

import Navbar from "@/app/components/Navbar";
import { MOCK_PRODUCTS } from "@/app/data/products";
import { ProductCard } from "@/app/components/ProductCard";
import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { slugify } from "@/app/lib/slugify";

type SortOption = "newest" | "alphabetical" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Novedad",
  alphabetical: "Alfabético (A-Z)",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
};

const ITEMS_PER_PAGE = 12;

export default function Productos() {
  const { addToCart } = useCart();
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Rango de precios disponible según los productos reales
  const overallMaxPrice = useMemo(
    () => Math.max(...MOCK_PRODUCTS.map((p) => Number(p.price))),
    []
  );
  const [maxPrice, setMaxPrice] = useState(overallMaxPrice);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);

  // CATEGORÍAS AUTOMÁTicas
  const categories = [
    "Todos",
    ...Array.from(
      new Set(MOCK_PRODUCTS.map((product) => product.category))
    ),
  ];

  // FILTRADO
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory =
      category === "Todos" ||
      product.category === category;

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesPrice = Number(product.price) <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // ORDENADO (memoizado para no re-ordenar en cada render innecesario)
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortBy) {
      case "alphabetical":
        return list.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" })
        );
      case "price-asc":
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case "newest":
      default:
        // Asume que los últimos agregados a MOCK_PRODUCTS son los más nuevos.
        // Si hay un campo de fecha (createdAt), reemplazar por ordenamiento por fecha.
        return list.reverse();
    }
  }, [filteredProducts, sortBy]);

  // Volvemos a la página 1 cada vez que cambia algún filtro u orden
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, sortBy, maxPrice]);

  // PAGINACIÓN
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Le agregamos el slug a cada producto antes de pasarlo a ProductCard,
  // para que el link a la página de detalle use la URL nueva.
  const productsWithSlug = paginatedProducts.map((product) => ({
    ...product,
    slug: slugify(product.name),
  }));

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <section className="px-8 md:px-20 pb-8">
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

      {/* FILTRO DE PRECIO */}
      <section className="px-8 md:px-20 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 max-w-md">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="price-range" className="text-sm font-semibold text-zinc-300">
                Precio máximo
              </label>
              <span className="text-sm font-mono text-cyan-400">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              id="price-range"
              type="range"
              min={0}
              max={overallMaxPrice}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-600 mt-2 font-mono">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(overallMaxPrice)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="px-8 md:px-20 pb-24">
        <div className="max-w-6xl mx-auto">
          
          {/* CONTADOR + ORDENAR */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          
            <p className="text-zinc-500 text-sm">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto"
                : "productos"}
              <span className="text-zinc-600"> · {category}</span>
            </p>

            {/* SELECTOR DE ORDEN */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="
                  appearance-none
                  bg-zinc-900
                  border
                  border-zinc-700
                  text-white
                  text-sm
                  font-medium
                  rounded-xl
                  pl-4
                  pr-10
                  py-2.5
                  outline-none
                  cursor-pointer
                  hover:border-cyan-500/50
                  focus:border-cyan-400
                  focus:shadow-[0_0_15px_rgba(6,182,212,0.3)]
                  transition-all
                  duration-300
                "
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <option key={option} value={option} className="bg-zinc-900 text-white">
                    {SORT_LABELS[option]}
                  </option>
                ))}
              </select>

              {/* Flecha custom */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          
          </div>

          {/* RESULTADOS */}
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productsWithSlug.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="
                      w-10 h-10
                      rounded-full
                      bg-zinc-900
                      border border-zinc-800
                      text-zinc-300
                      hover:border-cyan-500/50
                      hover:text-white
                      disabled:opacity-30
                      disabled:cursor-not-allowed
                      transition
                    "
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={
                        page === currentPage
                          ? "w-10 h-10 rounded-full bg-cyan-500 text-black font-bold transition"
                          : "w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition"
                      }
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="
                      w-10 h-10
                      rounded-full
                      bg-zinc-900
                      border border-zinc-800
                      text-zinc-300
                      hover:border-cyan-500/50
                      hover:text-white
                      disabled:opacity-30
                      disabled:cursor-not-allowed
                      transition
                    "
                    aria-label="Página siguiente"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
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
                  setMaxPrice(overallMaxPrice);
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