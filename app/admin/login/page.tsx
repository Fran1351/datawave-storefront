"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password === "DataWave123") {
      sessionStorage.setItem("datawave-admin", "true");
      router.push("/admin");
      return;
    }

    setError("Contraseña incorrecta");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (error) setError(""); // Limpia el mensaje de error al tipear
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-zinc-800/80">
        <h1 className="text-3xl font-bold">Panel de administración</h1>

        <p className="text-zinc-400 mt-2 mb-8">
          Ingresá la contraseña para continuar.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Contraseña"
              className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-zinc-600 transition placeholder:text-zinc-500"
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-sm mt-2 font-medium">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-zinc-200 transition active:scale-[0.99]"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}