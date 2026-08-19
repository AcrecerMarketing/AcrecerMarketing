import { prisma } from "@/lib/prisma";
import { PlanEditor } from "./PlanEditor";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
    include: { subscriptions: { where: { status: "ACTIVE" } } },
  });

  const influencerPlans = plans.filter((p) => p.audience === "INFLUENCER");
  const brandPlans = plans.filter((p) => p.audience === "BRAND");

  const toView = (p: (typeof plans)[number]) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    audience: p.audience,
    featured: p.featured,
    features: JSON.parse(p.features) as string[],
    subscriberCount: p.subscriptions.length,
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Planes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Administra precios y visibilidad de los planes ofrecidos en el sitio.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Influencers</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {influencerPlans.map((p) => (
            <PlanEditor key={p.id} plan={toView(p)} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Marcas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {brandPlans.map((p) => (
            <PlanEditor key={p.id} plan={toView(p)} />
          ))}
        </div>
      </div>
    </div>
  );
}
