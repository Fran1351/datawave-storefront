import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 text-sm py-12 px-8 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-white font-bold text-lg tracking-tight">DataWave</p>
          <p className="text-zinc-500 text-xs mt-1">
            Tecnología y accesorios seleccionados.
          </p>
        </div>

        <div className="flex gap-6 text-xs">
          <Link href="/" className="hover:text-white transition">
            Inicio
          </Link>
          <Link href="/productos" className="hover:text-white transition">
            Catálogo
          </Link>
          <Link href="/carrito" className="hover:text-white transition">
            Carrito
          </Link>
        </div>

        <p className="text-zinc-600 text-xs">
          © {new Date().getFullYear()} DataWave. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}