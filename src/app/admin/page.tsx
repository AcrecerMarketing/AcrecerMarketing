import { Users, DollarSign, TrendingUp, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  TRIALING: "bg-amber-500/15 text-amber-300",
  ACTIVE: "bg-emerald-500/15 text-emerald-300",
  PAST_DUE: "bg-rose-500/15 text-rose-300",
  CANCELED: "bg-slate-500/15 text-slate-300",
};

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      accounts: true,
      subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeSubs = clients
    .map((c) => c.subscriptions[0])
    .filter((s) => s && s.status === "ACTIVE");
  const mrr = activeSubs.reduce((sum, s) => sum + (s?.plan.price ?? 0), 0);
  const brandCount = clients.filter((c) => c.customerType === "BRAND").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <p className="mt-1 text-sm text-slate-400">Panel de administración de AcrecerMarketing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clientes totales" value={formatNumber(clients.length)} icon={Users} />
        <StatCard
          label="MRR estimado"
          value={formatCurrency(mrr)}
          delta={`${activeSubs.length} suscripciones activas`}
          icon={DollarSign}
        />
        <StatCard label="Marcas" value={formatNumber(brandCount)} icon={Building2} />
        <StatCard
          label="Influencers"
          value={formatNumber(clients.length - brandCount)}
          icon={TrendingUp}
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Cuenta</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const sub = client.subscriptions[0];
              const account = client.accounts[0];
              return (
                <tr key={client.id} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-xs text-slate-500">{client.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {client.customerType === "BRAND" ? "Marca" : "Influencer"}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {account ? `${account.handle} (${formatNumber(account.followersCurrent)})` : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{sub?.plan.name ?? "Sin plan"}</td>
                  <td className="px-6 py-4">
                    {sub ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[sub.status]}`}
                      >
                        {sub.status}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
