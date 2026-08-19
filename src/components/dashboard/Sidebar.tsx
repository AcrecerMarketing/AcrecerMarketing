"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Target,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const clientLinks = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/targeting", label: "Targeting", icon: Target },
  { href: "/dashboard/billing", label: "Facturación", icon: CreditCard },
  { href: "/dashboard/soporte", label: "Soporte", icon: LifeBuoy },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Clientes", icon: LayoutDashboard },
  { href: "/admin/plans", label: "Planes", icon: ShieldCheck },
];

export function Sidebar({ variant = "client" }: { variant?: "client" | "admin" }) {
  const pathname = usePathname();
  const links = variant === "admin" ? adminLinks : clientLinks;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-ink-900 px-4 py-6">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-gradient-soft text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </aside>
  );
}
