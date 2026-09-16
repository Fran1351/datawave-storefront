"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="fixed bottom-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-lg shadow-lg animate-bounce text-sm">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast debe usarse dentro de un ToastProvider");
  return context;
}