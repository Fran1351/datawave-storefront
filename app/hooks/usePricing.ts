"use client";

import { useEffect, useState } from "react";

type PromoType = "none" | "percent" | "fixed";
type PricingEntry = { price: number; promoType: PromoType; promoValue: number };
type PricingMap = { [key: number]: PricingEntry };

const PRICING_KEY = "datawave-pricing";

export function getEffectivePrice(entry: PricingEntry): number {
  if (entry.promoType === "percent" && entry.promoValue > 0) {
    return entry.price - (entry.price * entry.promoValue) / 100;
  }
  if (entry.promoType === "fixed" && entry.promoValue > 0) {
    return entry.promoValue;
  }
  return entry.price;
}

export function usePricing(productId: number, basePrice: number) {
  const [entry, setEntry] = useState<PricingEntry>({
    price: basePrice,
    promoType: "none",
    promoValue: 0,
  });

  useEffect(() => {
    const updateFromStorage = () => {
      const saved = localStorage.getItem(PRICING_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as PricingMap;
          if (parsed[productId]) {
            setEntry(parsed[productId]);
            return;
          }
        } catch (error) {
          console.error("Error leyendo precios guardados:", error);
        }
      }
      setEntry({ price: basePrice, promoType: "none", promoValue: 0 });
    };

    updateFromStorage();

    window.addEventListener("pricingUpdated", updateFromStorage);
    return () => {
      window.removeEventListener("pricingUpdated", updateFromStorage);
    };
  }, [productId, basePrice]);

  const finalPrice = getEffectivePrice(entry);
  const hasPromo = entry.promoType !== "none" && entry.promoValue > 0;

  return { price: entry.price, finalPrice, hasPromo };
}