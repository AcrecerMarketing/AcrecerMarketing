import { redirect } from "next/navigation";
import { Users, TrendingUp, Heart, Eye } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const account = await prisma.socialAccount.findFirst({
    where: { userId: session.user.id },
    include: {
      growthMetrics: { orderBy: { date: "asc" } },
    },
  });

  if (!account) {
    return (
      <Card>
        <p className="text-slate-300">
          Aún no tienes una cuenta configurada. Completa el onboarding para empezar.
        </p>
      </Card>
    );
  }

  const metrics = account.growthMetrics;
  const last = metrics[metrics.length - 1];
  const first = metrics[0];
  const netGrowth = last && first ? last.followers - first.followers : 0;
  const avgEngagement =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
      : 0;
  const totalNewFollowers = metrics.reduce((sum, m) => sum + m.newFollowers, 0);
  const avgProfileVisits =
    metrics.length > 0
      ? Math.round(metrics.reduce((sum, m) => sum + m.profileVisits, 0) / metrics.length)
      : 0;

  const chartData = metrics.map((m) => ({
    date: m.date.toISOString(),
    followers: m.followers,
    newFollowers: m.newFollowers,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Resumen de crecimiento</h1>
        <p className="mt-1 text-sm text-slate-400">
          {account.handle} · {account.niche ?? "Sin nicho definido"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Seguidores actuales"
          value={formatNumber(account.followersCurrent)}
          delta={`+${formatNumber(netGrowth)} en 90 días`}
          icon={Users}
        />
        <StatCard
          label="Nuevos seguidores"
          value={formatNumber(totalNewFollowers)}
          delta="últimos 90 días"
          icon={TrendingUp}
        />
        <StatCard
          label="Engagement promedio"
          value={`${avgEngagement.toFixed(1)}%`}
          delta="tasa sobre seguidores"
          icon={Heart}
        />
        <StatCard
          label="Visitas al perfil"
          value={formatNumber(avgProfileVisits)}
          delta="promedio diario"
          icon={Eye}
        />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Evolución de seguidores</h2>
          <span className="text-xs text-slate-500">Últimos 90 días</span>
        </div>
        <div className="mt-4">
          <GrowthChart data={chartData} />
        </div>
      </Card>
    </div>
  );
}
