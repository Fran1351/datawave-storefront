"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Cart() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  if (!mounted) {
    return null;
  }

  return (
    <Link href="/carrito">
      <button className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-zinc-200 transition">
        🛒 Carrito ({totalItems})
      </button>
    </Link>
  );
}