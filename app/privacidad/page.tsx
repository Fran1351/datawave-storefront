// NOTA: este es un texto genérico de referencia, no un documento legal validado.
// Reemplazá los datos entre [corchetes] por los reales de tu empresa y, si el
// volumen de venta lo justifica, hacé que un abogado lo revise antes de publicar.

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-500/10 via-blue-600/5 to-blue-700/10 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <article className="max-w-3xl mx-auto">
        <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black mt-2 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-zinc-500 mb-12">Última actualización: [fecha]</p>

        <div className="space-y-8 text-zinc-400 leading-relaxed text-sm md:text-base">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Qué datos recopilamos</h2>
            <p>Cuando navegás o comprás en el sitio podemos recopilar:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Datos de contacto: nombre, email, teléfono, dirección de envío.</li>
              <li>Datos de la compra: productos adquiridos, monto, forma de pago (el número de tarjeta nunca lo almacenamos nosotros; lo procesa Mercado Pago).</li>
              <li>Datos de navegación: cookies, dirección IP, dispositivo y páginas visitadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Para qué usamos tus datos</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Procesar y entregar tus pedidos.</li>
              <li>Comunicarnos con vos sobre el estado de tu compra.</li>
              <li>Responder consultas enviadas por el formulario de contacto.</li>
              <li>Mejorar el funcionamiento del sitio (análisis de uso, prevención de fraude).</li>
              <li>Enviarte novedades u ofertas, solo si diste tu consentimiento explícito.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Con quién compartimos tus datos</h2>
            <p>
              No vendemos tus datos personales a terceros. Los compartimos únicamente
              con proveedores necesarios para operar el servicio: pasarela de pago
              (Mercado Pago), servicio de envío/logística, y proveedor de hosting.
              Cada uno de ellos trata tus datos según sus propias políticas de
              privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Tus derechos</h2>
            <p>
              Conforme a la Ley 25.326 de Protección de Datos Personales, tenés
              derecho a acceder, rectificar, actualizar y suprimir tus datos
              personales. Podés ejercer estos derechos escribiendo a datawavee@gmail.com. La Agencia de Acceso a la Información Pública, en su carácter
              de Órgano de Control de la Ley 25.326, tiene la atribución de atender
              las denuncias y reclamos que se interpongan con relación al
              incumplimiento de las normas sobre protección de datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies</h2>
            <p>
              Usamos cookies propias y de terceros para recordar tu sesión, tu
              carrito de compras y analizar el uso del sitio. Podés desactivarlas
              desde la configuración de tu navegador, aunque esto puede afectar el
              funcionamiento del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Los cambios
              importantes se van a notificar mediante un aviso visible en el sitio.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}