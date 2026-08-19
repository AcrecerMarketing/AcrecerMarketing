"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card p-8">
      <h1 className="text-xl font-bold text-white">Inicia sesión</h1>
      <p className="mt-1 text-sm text-slate-400">Accede a tu panel de crecimiento.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="mt-1.5 w-full" />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required className="mt-1.5 w-full" />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Iniciar sesión
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-brand-400 hover:text-brand-300">
          Regístrate gratis
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
        <p className="font-medium text-slate-300">Cuenta de demostración</p>
        <p className="mt-1">demo@acrecermarketing.com / demo1234</p>
      </div>
    </div>
  );
}
