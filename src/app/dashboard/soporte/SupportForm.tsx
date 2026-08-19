"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function SupportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch("/api/dashboard/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
      form.reset();
      router.refresh();
      setTimeout(() => setSent(false), 3000);
    }
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-white">Escribe a tu growth manager</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="subject">Asunto</label>
          <input id="subject" name="subject" required className="mt-1.5 w-full" />
        </div>
        <div>
          <label htmlFor="message">Mensaje</label>
          <textarea id="message" name="message" required rows={4} className="mt-1.5 w-full" />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar mensaje
          </button>
          {sent && <span className="text-sm text-emerald-400">Mensaje enviado</span>}
        </div>
      </form>
    </Card>
  );
}
