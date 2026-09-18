import Image from "next/image";
import Link from "next/link";
import { getProducts } from "../actions/products";
import { Product } from "@/app/types/product";
import { formatPrice } from "@/lib/utils";
import ProductCardClient from "@/app/components/ProductCardClient";

// NOTA: esta página asume que el tipo Product tiene un campo opcional
// `discountPrice?: number`. Si tu esquema real usa otro nombre
// (por ej. `salePrice`, `oldPrice`), reemplazalo en las líneas marcadas abajo.
type ProductWithDiscount = Product & { discountPrice?: number };

export default async function OfertasPage() {
  const products = (await getProducts()) as ProductWithDiscount[] | null;
  const hasError = !products;

  const offers = products
    ? products.filter(
        (p) =>
          typeof p.discountPrice === "number" &&
          p.discountPrice > 0 &&
          p.discountPrice < Number(p.price)
      )
    : [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-500/20 via-blue-600/15 to-blue-700/20 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Precios especiales</p>
          <h1 className="text-4xl md:text-6xl font-black mt-2">Ofertas del momento</h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Productos seleccionados con descuento por tiempo limitado.
          </p>
        </div>

        {hasError && (
          <p className="text-red-400 text-center py-10">Error al conectar con la base de datos.</p>
        )}

        {!hasError && offers.length === 0 && (
          <div className="text-center py-24 border border-zinc-800/80 rounded-3xl bg-zinc-900/30">
            <p className="text-zinc-400 text-lg">Por ahora no hay ofertas activas.</p>
            <Link
              href="/productos"
              className="inline-block mt-6 text-sky-300 font-semibold hover:text-sky-200 transition"
            >
              Ver todo el catálogo →
            </Link>
          </div>
        )}

        {!hasError && offers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((product) => {
              const discountPct = Math.round(
                100 - (Number(product.discountPrice) / Number(product.price)) * 100
              );

              return (
                <div
                  key={product.id}
                  className="group relative bg-zinc-900/30 border border-zinc-800/80 hover:border-sky-400/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col justify-between"
                >
                  {/* Badge de descuento */}
                  <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-sky-300 to-blue-600 text-black text-xs font-black px-3 py-1.5 rounded-full">
                    -{discountPct}%
                  </span>

                  <div>
                    <Link href={`/productos/${product.id}`}>
                      <div className="relative aspect-square bg-white/95 rounded-2xl overflow-hidden p-6">
                        <Image
                          src={product.image || "/placeholder.png"}
                          alt={product.name || "Producto"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    <div className="mt-6">
                      <span className="text-xs font-mono text-sky-300/80 uppercase tracking-wider">
                        {product.category || "Hardware"}
                      </span>
                      <h3 className="text-xl font-bold mt-1 text-white group-hover:text-sky-300 transition">
                        {product.name || product.title}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {product.description || "Sin descripción disponible."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">
                          {formatPrice(Number(product.discountPrice))}
                        </span>
                        <span className="text-sm text-zinc-500 line-through">
                          {formatPrice(Number(product.price))}
                        </span>
                      </div>
                      <span className="bg-white/10 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium">
                        Disponible ({product.stock ?? 0})
                      </span>
                    </div>

                    <ProductCardClient product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}