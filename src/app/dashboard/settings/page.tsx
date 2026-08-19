import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const account = await prisma.socialAccount.findFirst({ where: { userId: user.id } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Ajustes</h1>
        <p className="mt-1 text-sm text-slate-400">Gestiona tu perfil y cuenta conectada.</p>
      </div>

      <ProfileForm name={user.name} email={user.email} />

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Cuenta conectada</h2>
        {account ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Usuario</p>
              <p className="mt-1 text-sm font-medium text-white">{account.handle}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Nicho</p>
              <p className="mt-1 text-sm font-medium text-white">{account.niche ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Plataforma</p>
              <p className="mt-1 text-sm font-medium capitalize text-white">{account.platform}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No hay cuentas conectadas todavía.</p>
        )}
      </Card>
    </div>
  );
}
