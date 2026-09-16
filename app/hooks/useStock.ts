"use client";

import { useEffect, useState } from "react";

const STOCK_KEY = "datawave-stock";

export function useStock(productId: number, baseStock: number) {
  const [stock, setStock] = useState<number>(baseStock);

  useEffect(() => {
    const updateFromStorage = () => {
      const saved = localStorage.getItem(STOCK_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Record<number, number>;
          if (parsed[productId] !== undefined) {
            setStock(Number(parsed[productId]));
            return;
          }
        } catch (error) {
          console.error("Error leyendo stock guardado:", error);
        }
      }
      setStock(baseStock);
    };

    updateFromStorage();

    window.addEventListener("stockUpdated", updateFromStorage);
    return () => {
      window.removeEventListener("stockUpdated", updateFromStorage);
    };
  }, [productId, baseStock]);

  return { stock, hasStock: stock > 0 };
}