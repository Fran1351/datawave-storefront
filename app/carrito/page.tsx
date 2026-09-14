"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Formatear precio numérico a moneda local
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const items = cart.map((item) => ({
        id: String(item.id),
        title: item.name,
        unit_price: Number(item.numericPrice ?? item.price),
        quantity: Number(item.quantity),
        currency_id: "ARS",
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Hubo un error al iniciar el pago con Mercado Pago.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-8 md:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          Resumen
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-10">
          Tu Carrito
        </h1>

        {cart.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
            <svg
              className="w-16 h-16 mx-auto text-zinc-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-3">El carrito está vacío</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Explorá nuestro catálogo y encontrá la mejor tecnología y accesorios.
            </p>
            <Link
              href="/productos"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 justify-between"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="bg-white rounded-xl relative aspect-square w-20 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-zinc-400 text-sm">{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-zinc-800 pt-4 sm:pt-0">
                    {/* Control de cantidad */}
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-zinc-400 hover:text-white transition"
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span className="px-3 font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-zinc-400 hover:text-white transition"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal e botón de quitar */}
                    <div className="text-right">
                      <p className="font-bold">
                        {formatPrice((item.numericPrice ?? item.price) * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-2 transition"
                      aria-label="Eliminar producto"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={clearCart}
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition"
                >
                  Vaciar carrito
                </button>
                <Link
                  href="/productos"
                  className="text-sm font-semibold hover:underline"
                >
                  + Seguir comprando
                </Link>
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sticky top-28">
              <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Envío</span>
                  <span className="text-emerald-400 font-medium">Gratis</span>
                </div>

                <div className="border-t border-zinc-800 pt-4 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-xl">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="mt-8 w-full bg-white text-black font-bold py-4 rounded-full hover:bg-zinc-200 transition"
              >
                Iniciar compra
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Finalizar Compra */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Datos de envío</h3>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="juan@ejemplo.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  required
                  placeholder="Av. Corrientes 1234"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center mb-4">
                <span className="text-sm text-zinc-400">Total a pagar:</span>
                <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {isLoading ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}