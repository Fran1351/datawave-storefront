"use client";

import { useState, FormEvent } from "react";

const CONTACT_INFO = {
  whatsapp: "5493573507831", // reemplazar por el número real, sin espacios ni +
  email: "datawavee@gmail.com",
  address: "Río Segundo, Córdoba, Argentina",
  instagram: "https://instagram.com/datawavee__",
};

type Status = "idle" | "loading" | "sent" | "error";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al enviar el mensaje.");
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 px-6 md:px-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-500/20 via-blue-600/15 to-blue-700/20 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Hablemos</p>
          <h1 className="text-4xl md:text-6xl font-black mt-2">Contacto</h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            ¿Tenés una consulta sobre un producto, un pedido o algo más? Escribinos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-8 flex flex-col gap-5"
          >
            <div>
              <label htmlFor="name" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={status === "loading"}
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="mt-2 w-full bg-zinc-950/80 border border-zinc-800 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={status === "loading"}
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="mt-2 w-full bg-zinc-950/80 border border-zinc-800 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                disabled={status === "loading"}
                value={form.message}
                onChange={handleChange}
                placeholder="Contanos en qué te podemos ayudar"
                className="mt-2 w-full bg-zinc-950/80 border border-zinc-800 focus:border-sky-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition resize-none disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 bg-gradient-to-r from-sky-300 to-blue-600 text-black font-extrabold px-8 py-3.5 rounded-full text-sm hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition duration-300 self-start disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {status === "loading" ? "Enviando..." : "Enviar mensaje"}
            </button>

            {status === "sent" && (
              <p className="text-sm text-sky-300">
                Recibimos tu mensaje. Te respondemos a la brevedad.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}
          </form>

          {/* Datos de contacto */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-zinc-900/30 border border-zinc-800/80 hover:border-sky-400/40 rounded-2xl p-5 transition"
            >
              <span className="w-11 h-11 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-300 group-hover:bg-sky-500/20 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-6l-4 4v-4z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-white">WhatsApp</p>
                <p className="text-xs text-zinc-400">Respuesta rápida</p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="group flex items-center gap-4 bg-zinc-900/30 border border-zinc-800/80 hover:border-sky-400/40 rounded-2xl p-5 transition"
            >
              <span className="w-11 h-11 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-300 group-hover:bg-sky-500/20 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-white">Email</p>
                <p className="text-xs text-zinc-400">{CONTACT_INFO.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5">
              <span className="w-11 h-11 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-white">Ubicación</p>
                <p className="text-xs text-zinc-400">{CONTACT_INFO.address}</p>
              </div>
            </div>

            <a
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-zinc-900/30 border border-zinc-800/80 hover:border-sky-400/40 rounded-2xl p-5 transition"
            >
              <span className="w-11 h-11 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-300 group-hover:bg-sky-500/20 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-white">Instagram</p>
                <p className="text-xs text-zinc-400">@datawavee__</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}