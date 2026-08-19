"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

type PlanView = { id: string; name: string; price: number; tagline: string };

export function OnboardingForm({ plans, isBrand }: { plans: PlanView[]; isBrand: boolean }) {
  const router = useRouter();
  const [planId, setPlanId] = useState(plans[1]?.id ?? plans[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      handle: form.get("handle"),
      niche: form.get("niche"),
      followersCurrent: form.get("followersCurrent"),
      hashtags: form.get("hashtags"),
      locations: form.get("locations"),
      planId,
    };

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      setError("No pudimos guardar tu información. Intenta de nuevo.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="card space-y-4 p-6">
        <h2 className="text-sm font-semibold text-white">
          {isBrand ? "Cuenta de tu marca" : "Tu cuenta de Instagram"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="handle">Usuario de Instagram</label>
            <input id="handle" name="handle" placeholder="@tunombre" required className="mt-1.5 w-full" />
          </div>
          <div>
            <label htmlFor="followersCurrent">Seguidores actuales</label>
            <input
              id="followersCurrent"
              name="followersCurrent"
              type="number"
              min={0}
              required
              className="mt-1.5 w-full"
            />
          </div>
        </div>
        <div>
          <label htmlFor="niche">{isBrand ? "Categoría / industria" : "Nicho de contenido"}</label>
          <input
            id="niche"
            name="niche"
            placeholder={isBrand ? "Ej: moda sostenible" : "Ej: fitness, moda, viajes"}
            required
            className="mt-1.5 w-full"
          />
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-sm font-semibold text-white">Targeting inicial (opcional)</h2>
        <div>
          <label htmlFor="hashtags">Hashtags relevantes</label>
          <input
            id="hashtags"
            name="hashtags"
            placeholder="#moda, #ootd, #lifestyle"
            className="mt-1.5 w-full"
          />
        </div>
        <div>
          <label htmlFor="locations">Ubicaciones objetivo</label>
          <input
            id="locations"
            name="locations"
            placeholder="Bogotá, Ciudad de México, Madrid"
            className="mt-1.5 w-full"
          />
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-sm font-semibold text-white">Elige tu plan</h2>
        <div className="grid gap-3">
          {plans.map((plan) => (
            <button
              type="button"
              key={plan.id}
              onClick={() => setPlanId(plan.id)}
              className={cn(
                "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
                planId === plan.id
                  ? "border-brand-500/60 bg-brand-gradient-soft"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <div>
                <p className="text-sm font-semibold text-white">{plan.name}</p>
                <p className="text-xs text-slate-400">{plan.tagline}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  {plan.price > 0 ? `${formatCurrency(plan.price)}/mes` : "Personalizado"}
                </span>
                {planId === plan.id && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button type="submit" disabled={loading || !planId} className="btn-primary w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Ir a mi dashboard
      </button>
    </form>
  );
}
