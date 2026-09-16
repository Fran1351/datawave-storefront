"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/app/context/ToastContext";

interface CartItem {
  id: string | number;
  name?: string;
  title?: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string | number, qty: number) => void;
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity }: CartDrawerProps) {
  const { showToast } = useToast();

  const total = items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

  const handleCheckout = () => {
    showToast("Redirigiendo al medio de pago...");
    // Lógica de redirección a checkout
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro backdrop-blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />

          {/* Panel deslizante */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col justify-between"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Tu Carrito
              </h2>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-cyan-400 transition-colors font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-zinc-500 mt-10">Tu carrito está vacío.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-zinc-800 pb-4"
                  >
                    <div className="relative w-16 h-16 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.name || item.title || "Item"}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-sm text-white">
                        {item.name || item.title}
                      </h4>
                      <p className="text-zinc-400 text-sm font-mono">
                        {formatPrice(Number(item.price))}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Number(item.quantity) - 1)}
                          className="border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded text-xs hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium text-white font-mono">
                          {Number(item.quantity)}
                        </span>
                        <button
                          onClick={() => {
                            onUpdateQuantity(item.id, Number(item.quantity) + 1);
                            showToast("Cantidad actualizada");
                          }}
                          className="border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded text-xs hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Barra inferior fija (Sticky Bottom Bar) para móviles y desktop */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-xl sticky bottom-0">
              <div className="flex justify-between mb-4 font-semibold text-lg">
                <span className="text-zinc-300">Total:</span>
                <span className="text-white font-mono group-hover:[text-shadow:0_0_12px_rgba(34,211,238,0.8)]">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full bg-zinc-800 hover:bg-cyan-500 text-white hover:text-zinc-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] active:scale-95 disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:hover:text-white disabled:hover:shadow-none disabled:cursor-not-allowed"
              >
                Finalizar Compra
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}