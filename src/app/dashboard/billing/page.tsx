import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { PlanSwitcher } from "./PlanSwitcher";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  TRIALING: "En prueba",
  ACTIVE: "Activa",
  PAST_DUE: "Pago pendiente",
  CANCELED: "Cancelada",
};

export default async function BillingPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  });

  const plans = await prisma.plan.findMany({
    where: { audience: user.customerType },
    orderBy: { sortOrder: "asc" },
  });

  const planViews = plans.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    tagline: p.tagline,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Facturación</h1>
        <p className="mt-1 text-sm text-slate-400">
          Gestiona tu plan y consulta el estado de tu suscripción.
        </p>
      </div>

      {subscription ? (
        <Card className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs text-slate-400">Plan actual</p>
            <p className="mt-1 text-xl font-bold text-white">{subscription.plan.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Precio</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {subscription.plan.price > 0
                ? `${formatCurrency(subscription.plan.price)}/mes`
                : "Personalizado"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Estado</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {statusLabels[subscription.status] ?? subscription.status}
            </p>
          </div>
          {subscription.renewalDate && (
            <div>
              <p className="text-xs text-slate-400">Próxima renovación</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long" }).format(
                  subscription.renewalDate
                )}
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <p className="text-slate-300">Aún no tienes una suscripción activa.</p>
        </Card>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Cambiar de plan</h2>
        <PlanSwitcher plans={planViews} currentPlanId={subscription?.planId ?? ""} />
      </div>
    </div>
  );
}
