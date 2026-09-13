import Image from "next/image";
import Link from "next/link";
import { getProducts } from "./actions/products";
// El botón de "Añadir al Carrito" que interactúa con el carrito global se mantiene en un subcomponente o se adapta.

export default async function Home() {
  const { success, data: products, error } = await getProducts();
  const featuredProducts = success && products ? products.slice(0, 3) : [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/10 to-purple-600/20 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-600/10 to-cyan-500/10 blur-[160px] pointer-events-none -z-10 rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 md:px-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-cyan-500/30 backdrop-blur-md mb-8 text-xs font-semibold tracking-widest uppercase text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Hardware de Próxima Generación
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none max-w-5xl">
          El futuro del ecosistema{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 bg-clip-text text-transparent">
            digital ya llegó.
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
          Diseñado para quienes no aceptan límites. Experimentá la convergencia entre rendimiento extremo, estética minimalista e innovación de vanguardia.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/productos"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
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
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-t border-zinc-900 pt-10">
          <div>
            <p className="text-3xl font-extrabold text-white">99.9%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Sincronización</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">24h</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Envío Express</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">100%</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Garantía Oficial</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">4.9★</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Satisfacción Global</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Experience Section */}
      <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Ecosistema DataWave</p>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Tecnología sin compromisos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8 md:p-12 backdrop-blur-xl group hover:border-cyan-500/40 transition duration-500">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition duration-500" />
            <div className="relative z-10 max-w-md">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Audio Espacial</span>
              <h3 className="text-2xl md:text-4xl font-bold mt-2 text-white">Inmersión sonora hiperrealista</h3>
              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                Algoritmos acústicos avanzados diseñados para aislar el ruido exterior y envolverte en una atmósfera de audio pura.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8 backdrop-blur-xl group hover:border-purple-500/40 transition duration-500">
            <div className="relative z-10">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Carga Ultrarrápida</span>
              <h3 className="text-2xl font-bold mt-2 text-white">Potencia continua</h3>
              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                Arquitectura de transferencia magnética de alta densidad para mantener tus dispositivos listos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (Dinámicos desde Supabase) */}
      <section id="destacados" className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Catálogo Seleccionado</p>
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

        {error ? (
          <p className="text-red-400 text-center py-10">Error al conectar con la base de datos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-zinc-900/30 border border-zinc-800/80 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between"
              >
                <div>
                  <Link href={`/productos/${product.id}`}>
                    <div className="relative aspect-square bg-white/95 rounded-2xl overflow-hidden p-6">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="mt-6">
                    <span className="text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                      {product.category?.name || "Hardware"}
                    </span>
                    <h3 className="text-xl font-bold mt-1 text-white group-hover:text-cyan-300 transition">
                      {product.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <span className="text-xl font-bold text-white">
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                  {/* Nota: Para el botón de carrito que requiere interactividad del cliente, podemos conectarlo al contexto global */}
                  <span className="bg-white/10 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium">
                    Disponible ({product.stock})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cyberpunk Style CTA Banner */}
      <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-10 md:p-16 text-center flex flex-col items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-black max-w-2xl relative z-10">
            ¿Listo para llevar tu setup al siguiente nivel?
          </h2>
          <p className="mt-4 text-zinc-400 max-w-md relative z-10 text-sm md:text-base">
            Equipamiento de máxima calidad con envíos inmediatos y garantía asegurada.
          </p>
          <Link
            href="/productos"
            className="mt-8 relative z-10 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold px-10 py-4 rounded-full text-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition duration-300"
          >
            Ir a la Tienda
          </Link>
        </div>
      </section>
    </main>
  );
}