"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/dashboard/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name") }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <Card className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Perfil</h2>
        <div>
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" defaultValue={name} required className="mt-1.5 w-full" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" defaultValue={email} disabled className="mt-1.5 w-full opacity-60" />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar
          </button>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Guardado
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}
