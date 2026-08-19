import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { SupportForm } from "./SupportForm";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const tickets = await prisma.supportMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Soporte</h1>
        <p className="mt-1 text-sm text-slate-400">
          Contacta a tu growth manager para ajustes de estrategia o preguntas.
        </p>
      </div>

      <SupportForm />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Historial</h2>
        {tickets.length === 0 && (
          <p className="text-sm text-slate-400">Aún no has enviado mensajes.</p>
        )}
        {tickets.map((t) => (
          <Card key={t.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{t.subject}</p>
              <p className="mt-1 text-sm text-slate-400">{t.message}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                t.status === "open"
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-emerald-500/15 text-emerald-300"
              )}
            >
              {t.status === "open" ? "Abierto" : "Cerrado"}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
