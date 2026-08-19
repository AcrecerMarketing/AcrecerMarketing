import { prisma } from "@/lib/prisma";
import { PricingToggle } from "@/components/marketing/PricingToggle";
import { FAQ } from "@/components/marketing/FAQ";

export const dynamic = "force-dynamic";

export default async function PreciosPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });

  const toView = (p: (typeof plans)[number]) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    featured: p.featured,
    features: JSON.parse(p.features) as string[],
  });

  const influencerPlans = plans.filter((p) => p.audience === "INFLUENCER").map(toView);
  const brandPlans = plans.filter((p) => p.audience === "BRAND").map(toView);

  return (
    <>
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Planes claros, sin letra pequeña
            </h1>
            <p className="mt-4 text-slate-400">
              Cancela cuando quieras. Cambia de plan en cualquier momento desde tu
              panel de facturación.
            </p>
          </div>

          <div className="mt-14">
            <PricingToggle influencerPlans={influencerPlans} brandPlans={brandPlans} />
          </div>
        </div>
      </section>
      <FAQ />
    </>
  );
}
