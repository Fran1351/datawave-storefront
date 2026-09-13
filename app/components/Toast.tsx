"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-cyan-500/40 text-white px-5 py-4 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md animate-bounce-in">
      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
        ✓
      </div>
      <div>
        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Éxito</p>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-zinc-500 hover:text-white transition text-sm"
      >
        ✕
      </button>
    </div>
  );
}