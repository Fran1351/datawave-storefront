import { Metadata } from "next";
import ResetConsentButton from "./ResetConsentButton";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Qué información guardamos en tu navegador y para qué la usamos en DataWave.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">Legal</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-10">Política de Cookies</h1>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">¿Qué son las cookies?</h2>
            <p>
              Las cookies y el almacenamiento local del navegador son pequeños archivos que un
              sitio guarda en tu dispositivo para recordar información entre visitas: por
              ejemplo, qué productos tenés en el carrito, o si ya viste este aviso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">Qué guardamos hoy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Carrito de compras:</strong> guardamos el
                contenido de tu carrito en el almacenamiento local de tu navegador (clave{" "}
                <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-cyan-400 text-sm">
                  datawave-cart
                </code>
                ), para que no lo pierdas si cerrás la pestaña o recargás la página. Es
                estrictamente necesario para que la tienda funcione, así que no depende de tu
                aceptación en el aviso de cookies.
              </li>
              <li>
                <strong className="text-white">Tu elección sobre este aviso:</strong> guardamos
                si aceptaste o rechazaste las cookies, para no volver a mostrarte el banner en
                cada visita.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">Cookies de terceros</h2>
            <p>
              Cuando elegís pagar con Mercado Pago, te redirigimos a su sitio para completar el
              pago de forma segura. Una vez ahí, Mercado Pago puede instalar sus propias cookies
              según su propia política de privacidad — DataWave no tiene acceso ni control sobre
              esas cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">Cookies de análisis</h2>
            <p>
              Actualmente no usamos herramientas de analítica ni publicidad. Si en el futuro
              incorporamos alguna (por ejemplo, para entender qué páginas se visitan más), esas
              cookies solo se activarán si elegís <strong className="text-white">Aceptar</strong>{" "}
              en el aviso que aparece al entrar al sitio. Si elegís{" "}
              <strong className="text-white">Rechazar</strong>, seguimos guardando únicamente lo
              necesario para que la tienda funcione (tu carrito).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">Cambiar tu elección</h2>
            <p className="mb-4">
              Podés cambiar de opinión en cualquier momento. Al tocar el botón de abajo, se
              reinicia tu preferencia y el aviso de cookies vuelve a aparecer para que elijas de
              nuevo.
            </p>
            <ResetConsentButton />
          </section>
        </div>
      </div>
    </main>
  );
}