"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

type PaymentMethod = "mercadopago" | "transferencia" | "efectivo";

const BANK_ALIAS = "tiendadata";
const BANK_CVU = "0000003100030773703864";
const BANK_HOLDER = "Agustin Elian Rodriguez";

interface ShippingQuote {
  cost: number;
  zone: string;
  source: "correoargentino" | "estimado";
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mercadopago");
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; method: PaymentMethod } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requiresShipping = paymentMethod !== "efectivo";
  const shippingCost = requiresShipping ? shippingQuote?.cost ?? 0 : 0;
  const grandTotal = totalPrice + shippingCost;

  // Cotiza el envío automáticamente (con debounce) cada vez que cambia el CP
  useEffect(() => {
    if (!requiresShipping) {
      setShippingQuote(null);
      setQuoteError(null);
      return;
    }

    const digits = formData.zip.replace(/\D/g, "");
    if (digits.length < 4) {
      setShippingQuote(null);
      setQuoteError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsQuoting(true);
      setQuoteError(null);
      try {
        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zip: formData.zip }),
        });
        const data = await res.json();

        if (!res.ok) {
          setShippingQuote(null);
          setQuoteError(data.error || "No se pudo calcular el envío.");
        } else {
          setShippingQuote(data);
        }
      } catch (error) {
        console.error("Error cotizando envío:", error);
        setShippingQuote(null);
        setQuoteError("Error de conexión al calcular el envío.");
      } finally {
        setIsQuoting(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.zip, requiresShipping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requiresShipping && !shippingQuote) {
      alert("Ingresá un código postal válido para calcular el envío.");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = cart.map((item) => ({
        id: String(item.id),
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        currency_id: "ARS",
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customerName: formData.name,
          customerEmail: formData.email,
          shippingAddress: requiresShipping ? formData.address : "",
          shippingCity: requiresShipping ? formData.city : "",
          shippingZip: requiresShipping ? formData.zip : "",
          shippingCost,
          shippingZone: shippingQuote?.zone ?? null,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Hubo un error al procesar el pedido.");
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === "mercadopago") {
        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          alert("Hubo un error al iniciar la preferencia de pago.");
          setIsSubmitting(false);
        }
        return;
      }

      // Transferencia o efectivo: mostramos instrucciones en la misma página
      setConfirmedOrder({ id: data.orderId, method: paymentMethod });
      clearCart();
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error en el checkout:", error);
      setIsSubmitting(false);
    }
  };

  // Pantalla de confirmación (transferencia / efectivo)
  if (confirmedOrder) {
    const shortId = confirmedOrder.id.slice(0, 8).toUpperCase();

    return (
      <main className="min-h-screen bg-zinc-950 text-white pt-36 pb-20 px-6 max-w-2xl mx-auto">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-xl text-center">
          <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-cyan-400 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-black mb-2">¡PEDIDO REGISTRADO!</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Número de pedido: <span className="text-white font-mono">#{shortId}</span>
          </p>

          {confirmedOrder.method === "transferencia" ? (
            <div className="text-left bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-3">
              <h2 className="font-bold text-sm uppercase tracking-wider text-cyan-400 mb-2">
                Datos para transferir
              </h2>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Alias</span>
                <span className="font-mono font-semibold">{BANK_ALIAS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">CVU</span>
                <span className="font-mono font-semibold">{BANK_CVU}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Titular</span>
                <span className="font-semibold">{BANK_HOLDER}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-zinc-800 pt-3">
                <span className="text-zinc-400">Monto</span>
                <span className="font-bold">${grandTotal.toLocaleString("es-AR")}</span>
              </div>
              <p className="text-xs text-zinc-500 pt-2">
                Enviá el comprobante junto con el número de pedido #{shortId} por
                WhatsApp o email para que confirmemos tu compra.
              </p>
            </div>
          ) : (
            <div className="text-left bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-3">
              <h2 className="font-bold text-sm uppercase tracking-wider text-cyan-400 mb-2">
                Retiro en el local
              </h2>
              <p className="text-sm text-zinc-400">
                Tu pedido quedó reservado. Pagás en efectivo cuando pases a
                retirarlo por el local.
              </p>
              <div className="flex justify-between text-sm border-t border-zinc-800 pt-3">
                <span className="text-zinc-400">Total a abonar</span>
                <span className="font-bold">${grandTotal.toLocaleString("es-AR")}</span>
              </div>
              <p className="text-xs text-zinc-500 pt-2">
                Te vamos a contactar por email para coordinar el retiro.
                Mencioná el número de pedido #{shortId}.
              </p>
            </div>
          )}

          <Link
            href="/productos"
            className="inline-block mt-8 bg-cyan-400 text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-cyan-300 transition"
          >
            Seguir comprando
          </Link>
        </div>
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
        <p className="text-zinc-400 text-sm mt-1">Completá tus datos para continuar con el pago seguro.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulario de Checkout */}
        <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
          {/* Datos Personales y Envío */}
          <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-sm font-mono text-cyan-400 tracking-wider uppercase mb-4">
              1. Información de Envío y Contacto
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
                  placeholder="Juan Pérez"
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
                  placeholder="juan@ejemplo.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {requiresShipping && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Dirección de Entrega</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Av. Corrientes 1234"
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
                    {isQuoting && (
                      <p className="text-xs mt-1.5 text-zinc-500">Calculando envío...</p>
                    )}
                    {!isQuoting && shippingQuote && (
                      <p className="text-xs mt-1.5 text-cyan-400">
                        {shippingQuote.zone}: ${shippingQuote.cost.toLocaleString("es-AR")}
                        {shippingQuote.source === "estimado" && " (estimado)"}
                      </p>
                    )}
                    {!isQuoting && quoteError && (
                      <p className="text-xs mt-1.5 text-amber-400">{quoteError}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Método de pago */}
          <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-sm font-mono text-cyan-400 tracking-wider uppercase mb-4">
              2. Método de Pago
            </h2>
            <div className="space-y-3">
              {[
                { id: "mercadopago", label: "Mercado Pago", desc: "Tarjeta, débito o dinero en cuenta" },
                { id: "transferencia", label: "Transferencia bancaria", desc: "Alias / CVU, confirmás con el comprobante" },
                { id: "efectivo", label: "Efectivo — Retiro en el local", desc: "Pagás cuando vas a buscar tu pedido, sin costo de envío" },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === option.id
                      ? "border-cyan-400/70 bg-cyan-400/5"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id as PaymentMethod)}
                    className="mt-1 accent-cyan-400"
                  />
                  <div>
                    <p className="font-semibold text-sm">{option.label}</p>
                    <p className="text-xs text-zinc-400">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Botón de Pago */}
          <button
            type="submit"
            disabled={isSubmitting || (requiresShipping && !shippingQuote)}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold py-4 rounded-full text-sm transition duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting
              ? paymentMethod === "mercadopago"
                ? "CONECTANDO CON MERCADO PAGO..."
                : "PROCESANDO..."
              : paymentMethod === "mercadopago"
              ? `PAGAR $${grandTotal.toLocaleString("es-AR")} CON MERCADO PAGO`
              : `CONFIRMAR PEDIDO — $${grandTotal.toLocaleString("es-AR")}`}
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
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Cant: {Number(item.quantity)}</p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    ${(Number(item.price) * Number(item.quantity)).toLocaleString("es-AR")}
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
                <span>Envío {shippingQuote ? `(${shippingQuote.zone})` : ""}</span>
                <span
                  className={
                    !requiresShipping
                      ? "text-emerald-400 font-mono"
                      : shippingQuote
                      ? "text-white font-mono"
                      : "text-zinc-500 font-mono"
                  }
                >
                  {!requiresShipping
                    ? "RETIRO EN LOCAL"
                    : shippingQuote
                    ? `$${shippingQuote.cost.toLocaleString("es-AR")}`
                    : "Ingresá tu CP"}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-zinc-800/50">
                <span>Total</span>
                <span className="text-cyan-400">${grandTotal.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}