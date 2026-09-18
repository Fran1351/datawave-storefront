"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/app/data/products";
import { formatPrice } from "@/lib/utils";

type StockMap = { [key: number]: number };
type PromoType = "none" | "percent" | "fixed";
type PricingEntry = { price: number; promoType: PromoType; promoValue: number };
type PricingMap = { [key: number]: PricingEntry };

type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  paymentMethod: string;
  totalAmount: number;
  status: OrderStatus;
  updatedAt: string;
  items: OrderItem[];
};

const STOCK_KEY = "datawave-stock";
const PRICING_KEY = "datawave-pricing";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function AdminDashboard() {
  const [stock, setStock] = useState<StockMap>({});
  const [pricing, setPricing] = useState<PricingMap>({});
  const [activeTab, setActiveTab] = useState<"stock" | "prices" | "orders" | "settings">("stock");
  const [stockSaved, setStockSaved] = useState(false);
  const [pricingSaved, setPricingSaved] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const router = useRouter();

  useEffect(() => {
    // Stock: arranca desde MOCK_PRODUCTS, pero si ya hay algo guardado, prioriza eso
    const initialStock: StockMap = {};
    MOCK_PRODUCTS.forEach((p) => {
      initialStock[p.id] = p.stock ?? 0;
    });

    const savedStock = localStorage.getItem(STOCK_KEY);
    if (savedStock) {
      try {
        const parsed = JSON.parse(savedStock) as StockMap;
        Object.assign(initialStock, parsed);
      } catch (e) {
        console.error("Error leyendo stock guardado", e);
      }
    }
    setStock(initialStock);

    // Precios/promos: arranca desde MOCK_PRODUCTS, prioriza lo guardado
    const initialPricing: PricingMap = {};
    MOCK_PRODUCTS.forEach((p) => {
      initialPricing[p.id] = {
        price: Number(p.price),
        promoType: "none",
        promoValue: 0,
      };
    });

    const savedPricing = localStorage.getItem(PRICING_KEY);
    if (savedPricing) {
      try {
        const parsed = JSON.parse(savedPricing) as PricingMap;
        Object.entries(parsed).forEach(([id, entry]) => {
          initialPricing[Number(id)] = entry;
        });
      } catch (e) {
        console.error("Error leyendo precios guardados", e);
      }
    }
    setPricing(initialPricing);
  }, [router]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  async function fetchOrders() {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al cargar pedidos");
      }
      setOrders(data.orders);
    } catch (err: any) {
      setOrdersError(err.message || "Error al cargar pedidos");
    } finally {
      setOrdersLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo actualizar");
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert(err.message || "No se pudo actualizar el estado del pedido");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function handleStockChange(id: number, value: string) {
    const newStock = parseInt(value, 10);
    setStock((prev) => ({
      ...prev,
      [id]: isNaN(newStock) ? 0 : newStock,
    }));
    setStockSaved(false);
  }

  function handleSaveStock() {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
    window.dispatchEvent(new Event("stockUpdated"));
    setStockSaved(true);
    setTimeout(() => setStockSaved(false), 2000);
  }

  function handlePriceChange(id: number, value: string) {
    const newPrice = parseFloat(value);
    setPricing((prev) => ({
      ...prev,
      [id]: { ...prev[id], price: isNaN(newPrice) ? 0 : newPrice },
    }));
    setPricingSaved(false);
  }

  function handlePromoTypeChange(id: number, value: PromoType) {
    setPricing((prev) => ({
      ...prev,
      [id]: { ...prev[id], promoType: value, promoValue: value === "none" ? 0 : prev[id].promoValue },
    }));
    setPricingSaved(false);
  }

  function handlePromoValueChange(id: number, value: string) {
    const newValue = parseFloat(value);
    setPricing((prev) => ({
      ...prev,
      [id]: { ...prev[id], promoValue: isNaN(newValue) ? 0 : newValue },
    }));
    setPricingSaved(false);
  }

  function handleSavePricing() {
    localStorage.setItem(PRICING_KEY, JSON.stringify(pricing));
    window.dispatchEvent(new Event("pricingUpdated"));
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2000);
  }

  function getEffectivePrice(entry: PricingEntry): number {
    if (entry.promoType === "percent" && entry.promoValue > 0) {
      return entry.price - (entry.price * entry.promoValue) / 100;
    }
    if (entry.promoType === "fixed" && entry.promoValue > 0) {
      return entry.promoValue;
    }
    return entry.price;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500 selection:text-black flex">
      {/* BARRA LATERAL FIJA */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col shrink-0 min-h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
            📊
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            DataWave <span className="text-zinc-500 font-medium">Admin</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-left transition ${
              activeTab === "stock" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
          >
            📦 Gestión de Stock
          </button>
          <button
            onClick={() => setActiveTab("prices")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-left transition ${
              activeTab === "prices" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
          >
            💲 Precios y Promociones
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-left transition ${
              activeTab === "orders" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
          >
            🧾 Pedidos
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-left transition ${
              activeTab === "settings" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
          >
            ⚙️ Configuración
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition mt-auto"
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-zinc-800 gap-4 pt-4 sm:pt-0">
          <div>
            <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">Panel de Control</p>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              {activeTab === "stock"
                ? "Inventario de Productos"
                : activeTab === "prices"
                ? "Precios y Promociones"
                : activeTab === "orders"
                ? "Pedidos"
                : "Configuración del Sistema"}
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-4 py-2.5 rounded-2xl shadow-lg">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-zinc-500">datawave.admin@mail.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
              AU
            </div>
          </div>
        </header>

        {/* VISTA: GESTIÓN DE STOCK */}
        {activeTab === "stock" && (
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">Todos los productos ({MOCK_PRODUCTS.length})</h3>
              <input
                type="text"
                placeholder="Buscar producto..."
                className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-500 w-full sm:w-64 text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-800/40 text-zinc-400">
                  <tr>
                    <th className="p-4 font-medium uppercase text-xs">Producto</th>
                    <th className="p-4 font-medium uppercase text-xs">Categoría</th>
                    <th className="p-4 font-medium uppercase text-xs text-right">Precio</th>
                    <th className="p-4 font-medium uppercase text-xs text-center">Stock Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {MOCK_PRODUCTS.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 font-medium text-white flex items-center gap-3">
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-contain bg-white p-1 shrink-0"
                        />
                        <span className="line-clamp-1">{product.name}</span>
                      </td>
                      <td className="p-4 text-zinc-400">{product.category || "Sin categoría"}</td>
                      <td className="p-4 text-right font-semibold text-white tabular-nums">
                        {formatPrice(Number(product.price))}
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={stock[product.id] ?? 0}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                          className="w-20 bg-zinc-950 text-white text-center font-mono rounded-lg px-3 py-1.5 outline-none border border-zinc-700 focus:border-cyan-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
              <p className="text-zinc-500 text-xs">Mostrando {MOCK_PRODUCTS.length} productos.</p>
              <button
                onClick={handleSaveStock}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-sm transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                {stockSaved ? "✓ Guardado" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        )}

        {/* VISTA: PRECIOS Y PROMOCIONES */}
        {activeTab === "prices" && (
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">Todos los productos ({MOCK_PRODUCTS.length})</h3>
              <p className="text-zinc-500 text-xs mt-1">
                Configurá el precio base y, opcionalmente, una promoción por descuento % o precio fijo.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-800/40 text-zinc-400">
                  <tr>
                    <th className="p-4 font-medium uppercase text-xs">Producto</th>
                    <th className="p-4 font-medium uppercase text-xs text-right">Precio base</th>
                    <th className="p-4 font-medium uppercase text-xs text-center">Promoción</th>
                    <th className="p-4 font-medium uppercase text-xs text-center">Valor</th>
                    <th className="p-4 font-medium uppercase text-xs text-right">Precio final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {MOCK_PRODUCTS.map((product) => {
                    const entry = pricing[product.id] ?? { price: Number(product.price), promoType: "none" as PromoType, promoValue: 0 };
                    const finalPrice = getEffectivePrice(entry);
                    const hasPromo = entry.promoType !== "none" && entry.promoValue > 0;

                    return (
                      <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4 font-medium text-white flex items-center gap-3">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-contain bg-white p-1 shrink-0"
                          />
                          <span className="line-clamp-1">{product.name}</span>
                        </td>

                        <td className="p-4 text-right">
                          <input
                            type="number"
                            value={entry.price}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                            className="w-28 bg-zinc-950 text-white text-right font-mono rounded-lg px-3 py-1.5 outline-none border border-zinc-700 focus:border-cyan-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="0"
                          />
                        </td>

                        <td className="p-4 text-center">
                          <select
                            value={entry.promoType}
                            onChange={(e) => handlePromoTypeChange(product.id, e.target.value as PromoType)}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500 transition"
                          >
                            <option value="none">Ninguna</option>
                            <option value="percent">Descuento %</option>
                            <option value="fixed">Precio fijo</option>
                          </select>
                        </td>

                        <td className="p-4 text-center">
                          <input
                            type="number"
                            value={entry.promoValue}
                            onChange={(e) => handlePromoValueChange(product.id, e.target.value)}
                            disabled={entry.promoType === "none"}
                            placeholder={entry.promoType === "percent" ? "%" : "$"}
                            className="w-24 bg-zinc-950 text-white text-center font-mono rounded-lg px-3 py-1.5 outline-none border border-zinc-700 focus:border-cyan-500 transition disabled:opacity-30 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="0"
                          />
                        </td>

                        <td className="p-4 text-right">
                          {hasPromo ? (
                            <div className="flex flex-col items-end">
                              <span className="text-zinc-500 text-xs line-through">{formatPrice(entry.price)}</span>
                              <span className="text-emerald-400 font-bold font-mono">{formatPrice(finalPrice)}</span>
                            </div>
                          ) : (
                            <span className="text-white font-semibold font-mono">{formatPrice(finalPrice)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
              <p className="text-zinc-500 text-xs">Mostrando {MOCK_PRODUCTS.length} productos.</p>
              <button
                onClick={handleSavePricing}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-sm transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                {pricingSaved ? "✓ Guardado" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        )}

        {/* VISTA: PEDIDOS */}
        {activeTab === "orders" && (
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">
                Pedidos {!ordersLoading && `(${filteredOrders.length})`}
              </h3>

              <div className="flex items-center gap-2">
                {(["all", "PENDING", "PAID", "CANCELLED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                      statusFilter === s
                        ? "bg-cyan-500 text-black border-cyan-500"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    {s === "all" ? "Todos" : STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="p-12 text-center text-zinc-500">Cargando pedidos...</div>
            ) : ordersError ? (
              <div className="p-12 text-center text-red-400">{ordersError}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No hay pedidos para mostrar.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-800/40 text-zinc-400">
                    <tr>
                      <th className="p-4 font-medium uppercase text-xs">Cliente</th>
                      <th className="p-4 font-medium uppercase text-xs">Productos</th>
                      <th className="p-4 font-medium uppercase text-xs">Método</th>
                      <th className="p-4 font-medium uppercase text-xs text-right">Total</th>
                      <th className="p-4 font-medium uppercase text-xs text-center">Estado</th>
                      <th className="p-4 font-medium uppercase text-xs text-center">Actualizar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors align-top">
                        <td className="p-4">
                          <p className="font-medium text-white">{order.customerName}</p>
                          <p className="text-zinc-500 text-xs">{order.customerEmail}</p>
                          {order.shippingCity && (
                            <p className="text-zinc-600 text-xs mt-0.5">
                              {order.shippingCity}, {order.shippingProvince}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-zinc-400 text-xs">
                          {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                          <span className="block text-zinc-600">
                            ({order.items.reduce((acc, i) => acc + i.quantity, 0)} unidades)
                          </span>
                        </td>
                        <td className="p-4 text-zinc-400 capitalize">{order.paymentMethod}</td>
                        <td className="p-4 text-right font-semibold text-white tabular-nums">
                          {formatPrice(Number(order.totalAmount))}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[order.status]}`}
                          >
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500 transition disabled:opacity-50"
                          >
                            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VISTA: CONFIGURACIÓN */}
        {activeTab === "settings" && (
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Ajustes del Panel</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Configurá las preferencias generales de tu tienda y las credenciales de acceso rápido.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">Correo del Administrador</label>
                <input
                  type="email"
                  defaultValue="datawave.admin@mail.com"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">Moneda por Defecto</label>
                <select className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500">
                  <option>ARS ($ - Peso Argentino)</option>
                  <option>USD ($ - Dólar Estadounidense)</option>
                </select>
              </div>
              <button
                onClick={() => alert("Cambios guardados correctamente")}
                className="mt-4 px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-sm hover:bg-cyan-400 transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}