import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TargetingForm } from "./TargetingForm";

export const dynamic = "force-dynamic";

export default async function TargetingPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const account = await prisma.socialAccount.findFirst({
    where: { userId: session.user.id },
    include: { targeting: true },
  });

  const initial = {
    hashtags: account?.targeting?.hashtags ?? "",
    locations: account?.targeting?.locations ?? "",
    competitorAccounts: account?.targeting?.competitorAccounts ?? "",
    genderTarget: account?.targeting?.genderTarget ?? "all",
    ageMin: account?.targeting?.ageMin ?? 18,
    ageMax: account?.targeting?.ageMax ?? 65,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Targeting</h1>
        <p className="mt-1 text-sm text-slate-400">
          Define a quién quieres llegar. Tu growth manager usa esta configuración
          para dirigir el crecimiento de tu cuenta.
        </p>
      </div>

      <TargetingForm initial={initial} />
    </div>
  );
}
