"use client";

import { FormEvent, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

type Initial = {
  hashtags: string;
  locations: string;
  competitorAccounts: string;
  genderTarget: string;
  ageMin: number;
  ageMax: number;
};

export function TargetingForm({ initial }: { initial: Initial }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch("/api/dashboard/targeting", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Audiencia objetivo</h2>
        <div>
          <label htmlFor="hashtags">Hashtags</label>
          <input
            id="hashtags"
            name="hashtags"
            defaultValue={initial.hashtags}
            className="mt-1.5 w-full"
            placeholder="#moda, #ootd, #lifestyle"
          />
        </div>
        <div>
          <label htmlFor="locations">Ubicaciones</label>
          <input
            id="locations"
            name="locations"
            defaultValue={initial.locations}
            className="mt-1.5 w-full"
            placeholder="Bogotá, Ciudad de México, Madrid"
          />
        </div>
        <div>
          <label htmlFor="competitorAccounts">Cuentas de referencia</label>
          <input
            id="competitorAccounts"
            name="competitorAccounts"
            defaultValue={initial.competitorAccounts}
            className="mt-1.5 w-full"
            placeholder="@cuentareferencia1, @cuentareferencia2"
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Perfil demográfico</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="genderTarget">Género</label>
            <select id="genderTarget" name="genderTarget" defaultValue={initial.genderTarget} className="mt-1.5 w-full">
              <option value="all">Todos</option>
              <option value="female">Predominantemente femenino</option>
              <option value="male">Predominantemente masculino</option>
            </select>
          </div>
          <div>
            <label htmlFor="ageMin">Edad mínima</label>
            <input
              id="ageMin"
              name="ageMin"
              type="number"
              min={13}
              max={80}
              defaultValue={initial.ageMin}
              className="mt-1.5 w-full"
            />
          </div>
          <div>
            <label htmlFor="ageMax">Edad máxima</label>
            <input
              id="ageMax"
              name="ageMax"
              type="number"
              min={13}
              max={80}
              defaultValue={initial.ageMax}
              className="mt-1.5 w-full"
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar cambios
        </button>
        {saved && (
          <span className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Guardado
          </span>
        )}
      </div>
    </form>
  );
}
