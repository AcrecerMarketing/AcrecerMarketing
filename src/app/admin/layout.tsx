import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar variant="admin" />
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
