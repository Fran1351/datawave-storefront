"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/app/types/product";

type CartItem = Product & {
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => boolean;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("datawave-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al cargar el carrito", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("datawave-cart", JSON.stringify(cart));
  }, [cart]);

  // Devuelve true si pudo agregar, false si chocó con el límite de stock
  const addToCart = (product: Product): boolean => {
    const stock = Number(product.stock ?? 0);
    let added = true;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => String(item.id) === String(product.id));

      if (existing) {
        if (existing.quantity >= stock) {
          added = false;
          return prevCart;
        }
        return prevCart.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1, stock }
            : item
        );
      }

      if (stock <= 0) {
        added = false;
        return prevCart;
      }

      return [...prevCart, { ...product, stock, quantity: 1 }];
    });

    return added;
  };

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(id)));
  };

  // Devuelve true si pudo aplicar la cantidad pedida, false si la topeó al stock disponible
  const updateQuantity = (id: string | number, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(id);
      return true;
    }

    let withinStock = true;

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (String(item.id) !== String(id)) return item;
        const stock = Number(item.stock ?? 0);
        if (quantity > stock) {
          withinStock = false;
          return { ...item, quantity: stock };
        }
        return { ...item, quantity };
      })
    );

    return withinStock;
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((acc, item) => {
    const priceNum = typeof item.price === "number" ? item.price : 0;
    return acc + priceNum * item.quantity;
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}