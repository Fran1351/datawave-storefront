"use client";

import { useState } from "react";

type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

type OrderItem = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderResult = {
  id: string;
  status: OrderStatus;
  customerName: string;
  paymentMethod: string;
  totalAmount: number;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  updatedAt: string;
  items: OrderItem[];
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente de pago",
  PAID: "Pago confirmado",
  CANCELLED: "Cancelado",
};

const STATUS_STEPS: OrderStatus[] = ["PENDING", "PAID"];

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No encontramos tu pedido.");
        setIsLoading(false);
        return;
      }

      setOrder(data.order);
    } catch (err) {
      setError("Ocurrió un error al buscar tu pedido. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepIndex =
    order && order.status !== "CANCELLED" ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">Seguimiento</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-10">Estado de tu pedido</h1>

        <form
          onSubmit={handleSearch}
          className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Número de pedido</label>
            <input
              type="text"
              required
              placeholder="Lo recibiste por email al confirmar tu compra"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-cyan-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Email usado en la compra</label>
            <input
              type="email"
              required
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
          >
            {isLoading ? "Buscando..." : "Buscar pedido"}
          </button>
        </form>

        {order && (
          <div className="mt-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Pedido</p>
                <p className="font-mono text-white text-sm break-all">{order.id}</p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold border shrink-0 ${
                  order.status === "PAID"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : order.status === "CANCELLED"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            {/* Timeline simple */}
            {order.status !== "CANCELLED" && (
              <div>
                <div className="flex items-center gap-2">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          i <= currentStepIndex
                            ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                            : "bg-zinc-700"
                        }`}
                      />
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 ${
                            i < currentStepIndex ? "bg-cyan-400" : "bg-zinc-700"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>Pendiente</span>
                  <span>Pagado</span>
                </div>
              </div>
            )}

            <div className="border-t border-zinc-800 pt-6 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-300">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-zinc-400 font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-xl">{formatPrice(Number(order.totalAmount))}</span>
            </div>

            {order.shippingAddress && (
              <div className="border-t border-zinc-800 pt-4 text-sm text-zinc-400">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Envío a</p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingProvince}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}