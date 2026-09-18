// NOTA: este es un texto genérico de referencia, no un documento legal validado.
// Reemplazá los datos entre [corchetes] por los reales de tu empresa y, si el
// volumen de venta lo justifica, hacé que un abogado lo revise antes de publicar.

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-500/10 via-blue-600/5 to-blue-700/10 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <article className="max-w-3xl mx-auto">
        <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black mt-2 mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-zinc-500 mb-12">Última actualización: [fecha]</p>

        <div className="space-y-8 text-zinc-400 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y comprar en DataWave ([dominio.com]), operado por [Nombre
              de la empresa / razón social], CUIT [XX-XXXXXXXX-X], aceptás los
              siguientes términos y condiciones en su totalidad. Si no estás de
              acuerdo, te pedimos que no utilices el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Productos y precios</h2>
            <p>
              Los precios publicados están expresados en pesos argentinos (ARS) e
              incluyen los impuestos correspondientes, salvo que se indique lo
              contrario. Nos reservamos el derecho de modificar precios y stock sin
              aviso previo. Si detectamos un error de precio evidente en un pedido ya
              realizado, nos contactaremos para ofrecerte confirmar la compra al
              precio correcto o cancelarla con reembolso total.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Proceso de compra</h2>
            <p>
              La compra se confirma una vez que recibís el email de confirmación de
              pedido y el pago fue acreditado a través de Mercado Pago. Nos
              reservamos el derecho de cancelar pedidos ante sospecha de fraude,
              error de stock o datos de envío incompletos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Envíos</h2>
            <p>
              Los plazos de envío informados en el sitio son estimados y pueden
              variar según la localidad y el transportista. [Completar con
              política real de envíos: zonas de cobertura, costos, plazos.]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Cambios y devoluciones</h2>
            <p>
              Conforme a la Ley de Defensa del Consumidor (24.240), tenés derecho a
              arrepentirte de la compra dentro de los 10 días corridos desde que
              recibiste el producto, sin necesidad de justificar el motivo, siempre
              que el producto esté en su embalaje original y sin uso. Para
              iniciar un cambio o devolución, escribinos a [email de contacto] o por
              WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Garantía</h2>
            <p>
              Todos los productos cuentan con garantía legal de 30 días conforme a
              la normativa vigente, o el plazo mayor que indique el fabricante.
                La garantía cubre defectos de fabricación y no incluye daños por uso indebido, accidentes o desgaste natural. Para hacer efectiva la garantía,
              contactanos a WhatsApp con el detalle del problema y, si es
              posible, fotos del producto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Responsabilidad</h2>
            <p>
              DataWave no se responsabiliza por demoras causadas por el
              transportista, casos fortuitos o de fuerza mayor. La responsabilidad
              del sitio se limita al valor del producto adquirido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Modificaciones</h2>
            <p>
              Estos términos pueden actualizarse en cualquier momento. La versión
              vigente es siempre la publicada en esta página al momento de la
              compra.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}