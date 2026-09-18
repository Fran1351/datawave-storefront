// NOTA: contenido genérico de referencia. Ajustá las respuestas (plazos, medios
// de pago, zonas de envío) a tu operación real antes de publicar.

const FAQS = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Elegí los productos que querés desde el catálogo, agregalos al carrito y seguí los pasos de finalizar compra. Vas a recibir un email de confirmación una vez acreditado el pago.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Procesamos los pagos a través de Mercado Pago: tarjetas de crédito, débito, transferencia y dinero en cuenta.",
  },
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "3 a 7 días hábiles según la localidad. Envíos a todo el país. Los plazos pueden variar según la disponibilidad de stock y el transportista.",
  },
  {
    q: "¿Puedo hacer seguimiento de mi envío?",
    a: "Sí, una vez despachado tu pedido te enviamos el código de seguimiento por email para que puedas rastrearlo.",
  },
  {
    q: "¿Cómo cambio o devuelvo un producto?",
    a: "Tenés 10 días corridos desde que recibís el producto para arrepentirte de la compra, siempre que esté sin uso y en su embalaje original. Escribinos por WhatsApp o email para coordinar el cambio.",
  },
  {
    q: "¿Los productos tienen garantía?",
    a: "Sí, todos los productos cuentan con garantía legal de 30 días",
  },
  {
    q: "¿Cómo los contacto si tengo un problema con mi pedido?",
    a: "Podés escribirnos desde la página de Contacto, por WhatsApp o a nuestro email — respondemos en horario de atención.",
  },
];

export default function AyudaPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-500/10 via-blue-600/5 to-blue-700/10 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold text-sky-300 uppercase tracking-widest text-center">Soporte</p>
        <h1 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-center">Centro de Ayuda</h1>
        <p className="text-zinc-400 text-center mb-14 max-w-xl mx-auto">
          Respuestas a las preguntas más frecuentes. Si no encontrás lo que
          buscás, escribinos desde la página de Contacto.
        </p>

        <div className="space-y-4">
          {FAQS.map((item, i) => (
            <details
              key={i}
              className="group bg-zinc-900/30 border border-zinc-800/80 hover:border-sky-400/30 rounded-2xl px-6 py-5 transition"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-white text-sm md:text-base">
                {item.q}
                <span className="text-sky-400 transition-transform duration-300 group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 text-center bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-8">
          <p className="text-white font-bold text-lg">¿No encontraste tu respuesta?</p>
          <p className="text-zinc-400 text-sm mt-2">Escribinos y te ayudamos a resolverlo.</p>
          <a
            href="/contacto"
            className="inline-block mt-5 bg-gradient-to-r from-sky-300 to-blue-600 text-black font-extrabold px-8 py-3 rounded-full text-sm hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition duration-300"
          >
            Ir a Contacto
          </a>
        </div>
      </div>
    </main>
  );
}