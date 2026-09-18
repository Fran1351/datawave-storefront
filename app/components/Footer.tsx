import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900/80 text-zinc-400 py-16 px-8 mt-24 relative overflow-hidden">
      
      {/* Sutil brillo decorativo de fondo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-12 mb-16 relative z-10">
        
        {/* Columna del Logo y Descripción */}
        <div className="space-y-4 col-span-2 md:col-span-2">
          <Link href="/" className="group text-2xl font-black tracking-widest text-white flex items-center gap-2.5">
            <span className="text-sky-400 font-mono transition-transform duration-300 group-hover:translate-x-1">&gt;</span> 
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DATAWAVE
            </span>
          </Link>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Plataforma e-commerce especializada en tecnología de vanguardia, hardware de alto rendimiento y componentes exclusivos con envío rápido y seguro.
          </p>

          {/* Redes sociales */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://wa.me/5493511234567"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-800/80 hover:border-sky-400/50 flex items-center justify-center text-zinc-400 hover:text-sky-400 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-6l-4 4v-4z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/datawave"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-800/80 hover:border-sky-400/50 flex items-center justify-center text-zinc-400 hover:text-sky-400 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
              </svg>
            </a>
            <a
              href="mailto:hola@datawave.com"
              aria-label="Email"
              className="w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-800/80 hover:border-sky-400/50 flex items-center justify-center text-zinc-400 hover:text-sky-400 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Columna de Navegación (solo contenido navegable) */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-5 font-bold">Navegación</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/productos" className="hover:text-sky-400 transition-colors">
                Catálogo de Productos
              </Link>
            </li>
            <li>
              <Link href="/ofertas" className="hover:text-sky-400 transition-colors">
                Ofertas
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-sky-400 transition-colors">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna Tu Cuenta (acciones sobre el carrito/compra) */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-5 font-bold">Tu Cuenta</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/carrito" className="hover:text-sky-400 transition-colors">
                Mi Carrito
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-sky-400 transition-colors">
                Finalizar Compra
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna Legal & Soporte */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-5 font-bold">Legal & Soporte</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/privacidad" className="hover:text-sky-400 transition-colors">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="hover:text-sky-400 transition-colors">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link href="/ayuda" className="hover:text-sky-400 transition-colors">
                Centro de Ayuda
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria inferior y créditos */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 relative z-10 gap-4">
        <p>&copy; {new Date().getFullYear()} Datawave Storefront. Todos los derechos reservados.</p>
        <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <p className="font-mono text-[11px] text-zinc-400">Powered by Next.js & Mercado Pago</p>
        </div>
      </div>
    </footer>
  );
}