"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

type PlanView = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  audience: string;
  featured: boolean;
  features: string[];
  subscriberCount: number;
};

export function PlanEditor({ plan }: { plan: PlanView }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: plan.id, price: form.get("price") }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{plan.name}</p>
          <p className="text-xs text-slate-400">{plan.tagline}</p>
        </div>
        {plan.featured && (
          <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-medium text-white">
            Destacado
          </span>
        )}
      </div>

      <ul className="space-y-1.5 text-xs text-slate-400">
        {plan.features.slice(0, 3).map((f) => (
          <li key={f}>· {f}</li>
        ))}
      </ul>

      <p className="text-xs text-slate-500">
        {plan.subscriberCount} suscripción{plan.subscriberCount === 1 ? "" : "es"} activa
        {plan.subscriberCount === 1 ? "" : "s"}
      </p>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor={`price-${plan.id}`}>Precio mensual (USD)</label>
          <input
            id={`price-${plan.id}`}
            name="price"
            type="number"
            min={0}
            defaultValue={plan.price}
            className="mt-1.5 w-full"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-secondary">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Guardar
        </button>
      </form>
      {saved && (
        <span className="flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" /> Precio actualizado
        </span>
      )}
    </Card>
  );
}
