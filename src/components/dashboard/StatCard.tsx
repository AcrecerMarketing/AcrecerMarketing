import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  positive?: boolean;
}) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        {delta && (
          <p className={cn("mt-1 text-xs font-medium", positive ? "text-emerald-400" : "text-rose-400")}>
            {delta}
          </p>
        )}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
        <Icon className="h-5 w-5" />
      </span>
    </Card>
  );
}
