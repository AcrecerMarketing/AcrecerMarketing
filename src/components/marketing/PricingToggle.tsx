"use client";

import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { cn } from "@/lib/utils";

type PlanView = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  featured: boolean;
  features: string[];
};

export function PricingToggle({
  influencerPlans,
  brandPlans,
}: {
  influencerPlans: PlanView[];
  brandPlans: PlanView[];
}) {
  const [audience, setAudience] = useState<"influencer" | "brand">("influencer");
  const plans = audience === "influencer" ? influencerPlans : brandPlans;

  return (
    <div>
      <div className="mx-auto flex w-fit rounded-full border border-white/10 bg-white/5 p-1">
        {(
          [
            { key: "influencer", label: "Para influencers" },
            { key: "brand", label: "Para marcas" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setAudience(tab.key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              audience === tab.key ? "bg-brand-gradient text-white" : "text-slate-400 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            tagline={plan.tagline}
            price={plan.price}
            features={plan.features}
            featured={plan.featured}
          />
        ))}
      </div>
    </div>
  );
}
