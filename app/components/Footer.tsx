import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900/80 text-zinc-400 py-16 px-8 mt-24 relative overflow-hidden">
      
      {/* Sutil brillo decorativo de fondo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        
        {/* Columna del Logo y Descripción */}
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="group text-2xl font-black tracking-widest text-white flex items-center gap-2.5">
            <span className="text-cyan-400 font-mono transition-transform duration-300 group-hover:translate-x-1">&gt;</span> 
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DATAWAVE
            </span>
          </Link>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Plataforma e-commerce especializada en tecnología de vanguardia, hardware de alto rendimiento y componentes exclusivos con envío rápido y seguro.
          </p>
        </div>

        {/* Columna de Navegación */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-5 font-bold">Navegación</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/productos" className="hover:text-cyan-400 transition-colors">
                Catálogo de Productos
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-cyan-400 transition-colors">
                Mi Carrito
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-cyan-400 transition-colors">
                Finalizar Compra
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna Legal & Soporte */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-5 font-bold">Legal & Soporte</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="text-zinc-600 cursor-not-allowed hover:text-zinc-500 transition-colors">Política de Privacidad</span>
            </li>
            <li>
              <span className="text-zinc-600 cursor-not-allowed hover:text-zinc-500 transition-colors">Términos y Condiciones</span>
            </li>
            <li>
              <span className="text-zinc-600 cursor-not-allowed hover:text-zinc-500 transition-colors">Centro de Ayuda</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria inferior y créditos */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 relative z-10 gap-4">
        <p>&copy; {new Date().getFullYear()} Datawave Storefront. Todos los derechos reservados.</p>
        <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <p className="font-mono text-[11px] text-zinc-400">Powered by Next.js & Mercado Pago</p>
        </div>
      </div>
    </footer>
  );
}