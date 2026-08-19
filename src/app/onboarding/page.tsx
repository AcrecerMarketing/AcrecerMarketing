import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "./OnboardingForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");
  if (user.onboarded) redirect("/dashboard");

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
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white">
          Configura tu cuenta, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-slate-400">
          Con esta información tu growth manager arma tu estrategia de targeting.
        </p>

        <div className="mt-10">
          <OnboardingForm plans={planViews} isBrand={user.customerType === "BRAND"} />
        </div>
      </div>
    </div>
  );
}
