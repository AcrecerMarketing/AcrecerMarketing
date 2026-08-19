"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegistroPage() {
  const router = useRouter();
  const [customerType, setCustomerType] = useState<"INFLUENCER" | "BRAND">("INFLUENCER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      customerType,
    };

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos crear tu cuenta.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="card p-8">
      <h1 className="text-xl font-bold text-white">Crea tu cuenta</h1>
      <p className="mt-1 text-sm text-slate-400">Empieza a crecer en menos de 2 minutos.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setCustomerType("INFLUENCER")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
            customerType === "INFLUENCER"
              ? "border-brand-500/60 bg-brand-gradient-soft text-white"
              : "border-white/10 text-slate-400 hover:text-white"
          )}
        >
          <Sparkles className="h-5 w-5" />
          Soy influencer
        </button>
        <button
          type="button"
          onClick={() => setCustomerType("BRAND")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
            customerType === "BRAND"
              ? "border-brand-500/60 bg-brand-gradient-soft text-white"
              : "border-white/10 text-slate-400 hover:text-white"
          )}
        >
          <Building2 className="h-5 w-5" />
          Soy una marca
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name">Nombre completo</label>
          <input id="name" name="name" type="text" required className="mt-1.5 w-full" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="mt-1.5 w-full" />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1.5 w-full"
          />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Crear cuenta gratis
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-brand-400 hover:text-brand-300">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
