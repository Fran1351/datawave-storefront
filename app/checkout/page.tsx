"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          ¡PEDIDO CONFIRMADO!
        </h1>
        <p className="text-zinc-400 max-w-md text-sm mb-8 leading-relaxed">
          Gracias por tu compra, <span className="text-cyan-400 font-semibold">{formData.name}</span>. Hemos enviado el comprobante de pago e información de seguimiento a <span className="text-zinc-200">{formData.email}</span>.
        </p>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mb-8 text-left space-y-2 text-xs font-mono">
          <div className="flex justify-between text-zinc-500">
            <span>ID de Orden:</span>
            <span className="text-cyan-400 font-bold">#DW-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Método de Entrega:</span>
            <span className="text-zinc-300">Envío Express Gratis</span>
          </div>
        </div>
        <Link
          href="/"
          className="bg-white text-black font-extrabold px-8 py-3.5 rounded-full text-sm hover:bg-cyan-400 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          Volver a la Tienda
        </Link>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white pt-36 pb-20 px-6 text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-zinc-400 text-sm mb-6">Agregá productos al carrito antes de proceder al pago.</p>
        <Link
          href="/productos"
          className="bg-cyan-400 text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-cyan-300 transition"
        >
          Explorar Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">FINALIZAR COMPRA</h1>
        <p className="text-zinc-400 text-sm mt-1">Completá tus datos para procesar el pedido.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulario de Checkout */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          {/* Datos Personales */}
          <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-sm font-mono text-cyan-400 tracking-wider uppercase mb-4">
              1. Información de Envío
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Dirección de Entrega</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Av. Principal 1234"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Código Postal</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="C1000"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </section>

          {/* Datos de Pago (Simulados) */}
          <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-sm font-mono text-cyan-400 tracking-wider uppercase mb-4">
              2. Método de Pago (Simulación)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs text-zinc-400 mb-1">Número de Tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  required
                  maxLength={19}
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="4532 •••• •••• 8890"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Vencimiento</label>
                <input
                  type="text"
                  name="cardExp"
                  required
                  placeholder="MM/AA"
                  maxLength={5}
                  value={formData.cardExp}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">CVC / CVV</label>
                <input
                  type="text"
                  name="cardCvc"
                  required
                  maxLength={4}
                  value={formData.cardCvc}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold py-4 rounded-full text-sm transition duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? "PROCESANDO COMPRA..." : `PAGAR $${totalPrice.toLocaleString("es-AR")}`}
          </button>
        </form>

        {/* Resumen de Compra */}
        <aside className="lg:col-span-5">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl sticky top-28 space-y-6">
            <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-4">
              Resumen del Pedido ({cart.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl || item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Cant: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Envío</span>
                <span className="text-emerald-400 font-mono">GRATIS</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-zinc-800/50">
                <span>Total</span>
                <span className="text-cyan-400">${totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}