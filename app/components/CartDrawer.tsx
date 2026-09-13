"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop oscuro */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white p-6 flex flex-col justify-between shadow-2xl relative">
          
          {/* Header del Drawer */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Tu Carrito</h2>
                <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-mono">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition p-2"
              >
                ✕
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-zinc-500">
                  <p className="text-sm">El carrito está vacío.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 items-center justify-between"
                  >
                    <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-xs text-cyan-400 font-bold mt-0.5">{item.price}</p>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-red-400 text-xs p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer del Drawer */}
          <div className="border-t border-zinc-900 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-zinc-400">Total Estimado</span>
              <span className="text-2xl font-black text-white">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>

            <div className="space-y-3">
              <Link
                href="/carrito"
                onClick={onClose}
                className="w-full block text-center bg-white hover:bg-cyan-300 text-black font-bold py-3.5 rounded-full text-sm transition"
              >
                Finalizar Compra
              </Link>
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition py-2"
              >
                Continuar comprando
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}