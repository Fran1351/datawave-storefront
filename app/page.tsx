import Image from "next/image";
import Link from "next/link";
import { getProducts } from "./actions/products";
import { Product } from "@/app/types/product";
import { formatPrice } from "@/lib/utils";
import ProductCardClient from "@/app/components/ProductCardClient";

export default async function Home() {
  const products = await getProducts();
  const hasError = !products;
  const featuredProducts = products ? products.slice(0, 3) : [];
  const categoryMap = new Map<string, { name: string; image: string; count: number }>();

  if (products) {
    for (const product of products) {
      const categoryName =
        typeof product.category === "object" && product.category !== null
          ? (product.category as { name: string }).name
          : product.category || "General";

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          image: product.image || "/placeholder.png",
          count: 1,
        });
      } else {
        categoryMap.get(categoryName)!.count += 1;
      }
    }
  }

  const categories = Array.from(categoryMap.values()).slice(0, 6);

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-sky-400 selection:text-black overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-500/20 via-blue-600/15 to-blue-700/20 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-700/10 to-sky-400/10 blur-[160px] pointer-events-none -z-10 rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 md:px-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-sky-400/30 backdrop-blur-md mb-8 text-xs font-semibold tracking-widest uppercase text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Hardware de Próxima Generación
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none max-w-5xl">
          Tecnología que{" "}
          <span className="bg-gradient-to-r from-sky-300 via-sky-400 to-blue-600 bg-clip-text text-transparent">
            eleva tu día.
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
         Descubrí productos que combinan diseño, innovación y calidad. Todo lo que necesitás, en un solo lugar.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/productos"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all duration-300 hover:bg-sky-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]"
          >
            <span>Explorar Catálogo</span>
            <svg
              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="#destacados"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium text-sm transition-all backdrop-blur-md"
          >
            Ver Destacados
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="mt-20 grid grid-cols-3 gap-8 w-full max-w-4xl border-t border-zinc-900 pt-10">
          <div>
            <p className="text-3xl font-extrabold text-white">8:00 a 21:00</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Atención al Cliente</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Garantía de funcionamiento</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">4.9★</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Satisfacción</p>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      {categories.length > 0 && (
        <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Explorá</p>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Comprá por categoría</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/productos?categoria=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-sky-400/40 transition duration-500 aspect-[4/3]"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{cat.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {cat.count} {cat.count === 1 ? "producto" : "productos"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bento Grid Experience Section */}
      <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Ecosistema DataWave</p>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Tecnología sin compromisos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8 md:p-12 backdrop-blur-xl group hover:border-sky-400/40 transition duration-500">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition duration-500" />
            <div className="relative z-10 max-w-md">
              <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Calidad premium</span>
              <h3 className="text-2xl md:text-4xl font-bold mt-2 text-white">Productos importados Seleccionados</h3>
              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                Cada producto es cuidadosamente seleccionado para garantizar un rendimiento excepcional y una experiencia de usuario superior.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8 backdrop-blur-xl group hover:border-blue-500/40 transition duration-500">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition duration-500" />
            <div className="relative z-10">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Envios a todo el país</span>
              <h3 className="text-2xl font-bold mt-2 text-white">Seguro</h3>
              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                Garantizamos que tu pedido llegue en perfectas condiciones, con opciones de seguimiento y soporte durante todo el proceso de envío.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="destacados" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Catálogo Seleccionado</p>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">Productos Destacados</h2>
          </div>
          <Link
            href="/productos"
            className="text-sm font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1 group"
          >
            Ver todos los productos
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {hasError ? (
          <p className="text-red-400 text-center py-10">Error al conectar con la base de datos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product: Product) => (
              <div
                key={product.id}
                className="group relative bg-zinc-900/30 border border-zinc-800/80 hover:border-sky-400/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col justify-between"
              >
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
                    <span className="text-xl font-bold text-white">
                      {formatPrice(Number(product.price))}
                    </span>
                    <span className="bg-white/10 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium">
                      Disponible ({product.stock ?? 0})
                    </span>
                  </div>

                  {/* Botón interactivo cliente */}
                  <ProductCardClient product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner Final */}
      <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-10 md:p-16 text-center flex flex-col items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-black max-w-2xl relative z-10">
            ¿Listo para encontrar tu próximo producto favorito?
          </h2>
          <p className="mt-4 text-zinc-400 max-w-md relative z-10 text-sm md:text-base">
            Calidad garantizada, envíos a todo el país y atención personalizada.
          </p>
          <Link
            href="/productos"
            className="mt-8 relative z-10 bg-gradient-to-r from-sky-300 to-blue-600 text-black font-extrabold px-10 py-4 rounded-full text-sm hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition duration-300"
          >
            Ir a la Tienda
          </Link>
        </div>
      </section>
    </main>
  );
}