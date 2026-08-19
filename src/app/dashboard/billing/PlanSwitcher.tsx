"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

type PlanView = { id: string; name: string; price: number; tagline: string };

export function PlanSwitcher({ plans, currentPlanId }: { plans: PlanView[]; currentPlanId: string }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function changePlan(planId: string) {
    setLoadingId(planId);
    await fetch("/api/dashboard/subscription", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div className="grid gap-3">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        return (
          <div
            key={plan.id}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4",
              isCurrent ? "border-brand-500/60 bg-brand-gradient-soft" : "border-white/10"
            )}
          >
            <div>
              <p className="text-sm font-semibold text-white">{plan.name}</p>
              <p className="text-xs text-slate-400">{plan.tagline}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">
                {plan.price > 0 ? `${formatCurrency(plan.price)}/mes` : "Personalizado"}
              </span>
              {isCurrent ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <Check className="h-3.5 w-3.5" /> Actual
                </span>
              ) : (
                <button
                  onClick={() => changePlan(plan.id)}
                  disabled={loadingId !== null}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  {loadingId === plan.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Cambiar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
