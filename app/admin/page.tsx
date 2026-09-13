"use client";

import { products } from "../data/products";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [stock, setStock] = useState<Record<number, number>>({});

  // 1. Verificación de autenticación
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("datawave-admin");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 2. Carga inicial del stock
  useEffect(() => {
    if (!isAuthenticated) return;

    const savedStock = localStorage.getItem("datawave-stock");

    if (savedStock) {
      try {
        setStock(JSON.parse(savedStock));
        return;
      } catch (error) {
        console.error("Error cargando stock:", error);
      }
    }

    const initialStock = products.reduce(
      (acc: Record<number, number>, product) => {
        acc[product.id] = product.stock ?? 0;
        return acc;
      },
      {}
    );

    setStock(initialStock);
  }, [isAuthenticated]);

  // 3. Sincronización con localStorage y emisión de evento
  useEffect(() => {
    if (Object.keys(stock).length > 0) {
      localStorage.setItem("datawave-stock", JSON.stringify(stock));
      window.dispatchEvent(new Event("stockUpdated"));
    }
  }, [stock]);

  function increase(id: number) {
    setStock((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }));
  }

  function decrease(id: number) {
    setStock((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] ?? 0) - 1),
    }));
  }

  function handleLogout() {
    sessionStorage.removeItem("datawave-admin");
    router.replace("/admin/login");
  }

  // Evita renderizar el contenido mientras verifica sesión
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-500">Cargando panel...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-8 md:px-20 py-28">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Administración</h1>
            <p className="text-zinc-400 mt-2">Controlá el stock de tus productos.</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-fit border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white px-5 py-2.5 rounded-full text-sm transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="bg-white rounded-2xl p-3 w-20 h-20 shrink-0 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="text-zinc-400 mt-1">{product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={() => decrease(product.id)}
                  className="w-10 h-10 bg-zinc-800 rounded-full hover:bg-zinc-700 text-xl font-bold transition flex items-center justify-center"
                >
                  −
                </button>

                <div className="text-center min-w-20">
                  <p className="text-2xl font-bold">
                    {stock[product.id] ?? 0}
                  </p>
                  <p className="text-zinc-500 text-sm">unidades</p>
                </div>

                <button
                  onClick={() => increase(product.id)}
                  className="w-10 h-10 bg-zinc-800 rounded-full hover:bg-zinc-700 text-xl font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}