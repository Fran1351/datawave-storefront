import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-zinc-950 text-white px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-4">
          Error 404
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Esta página no existe</h1>
        <p className="text-zinc-400 mb-10 leading-relaxed">
          Puede que el link esté roto, el producto ya no esté disponible, o hayas
          escrito mal la dirección.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition"
          >
            Volver al inicio
          </Link>
          <Link
            href="/productos"
            className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-full font-bold hover:border-cyan-500/50 transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </main>
  );
}