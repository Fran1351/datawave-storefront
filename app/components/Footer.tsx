import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono">&gt;</span> DATAWAVE
          </Link>
          <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
            Plataforma e-commerce especializada en tecnología de vanguardia, hardware de alto rendimiento y componentes exclusivos con envío rápido y seguro.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4">Navegación</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/productos" className="hover:text-white transition">
                Catálogo de Productos
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-white transition">
                Mi Carrito
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-white transition">
                Finalizar Compra
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4">Legal & Soporte</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="text-zinc-600 cursor-not-allowed">Política de Privacidad</span>
            </li>
            <li>
              <span className="text-zinc-600 cursor-not-allowed">Términos y Condiciones</span>
            </li>
            <li>
              <span className="text-zinc-600 cursor-not-allowed">Centro de Ayuda</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600">
        <p>&copy; {new Date().getFullYear()} Datawave Storefront. Todos los derechos reservados.</p>
        <p className="font-mono mt-2 sm:mt-0 text-[11px]">Powered by Next.js & Mercado Pago</p>
      </div>
    </footer>
  );
}