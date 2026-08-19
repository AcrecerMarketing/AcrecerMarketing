"use client";

import { FormEvent, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">¡Mensaje enviado!</h3>
        <p className="text-sm text-slate-400">
          Gracias por escribirnos. Nuestro equipo te contactará en menos de 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-8">
      <div>
        <label htmlFor="name">Nombre completo</label>
        <input id="name" name="name" type="text" required className="mt-1.5 w-full" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="mt-1.5 w-full" />
      </div>
      <div>
        <label htmlFor="company">Empresa / marca (opcional)</label>
        <input id="company" name="company" type="text" className="mt-1.5 w-full" />
      </div>
      <div>
        <label htmlFor="message">¿Cómo podemos ayudarte?</label>
        <textarea id="message" name="message" required rows={4} className="mt-1.5 w-full" />
      </div>

      {status === "error" && (
        <p className="text-sm text-rose-400">
          Algo salió mal. Por favor intenta nuevamente.
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar mensaje
      </button>
    </form>
  );
}
