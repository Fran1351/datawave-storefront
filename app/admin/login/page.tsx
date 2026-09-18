"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Contraseña incorrecta");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Error al iniciar sesión. Intentá de nuevo.");
      setIsLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (error) setError("");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-zinc-800/80 shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Panel de administración</h1>

        <p className="text-zinc-400 mt-2 mb-8 text-sm">
          Ingresá la contraseña para continuar con la gestión.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <input
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Contraseña"
              disabled={isLoading}
              className="w-full bg-zinc-800/70 text-white rounded-xl px-4 py-3.5 outline-none border border-zinc-700/50 focus:border-zinc-500 transition placeholder:text-zinc-500 text-sm disabled:opacity-50"
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-xs font-medium pl-1 animate-fadeIn">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-zinc-950 py-3.5 rounded-xl font-medium hover:bg-zinc-200 transition active:scale-[0.99] text-sm disabled:opacity-50"
          >
            {isLoading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}