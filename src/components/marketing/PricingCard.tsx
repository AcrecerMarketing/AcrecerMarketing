import Link from "next/link";
import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function PricingCard({
  name,
  tagline,
  price,
  features,
  featured,
  href = "/registro",
}: {
  name: string;
  tagline: string;
  price: number;
  features: string[];
  featured?: boolean;
  href?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8",
        featured
          ? "border-brand-500/50 bg-brand-gradient-soft shadow-xl shadow-brand-900/30"
          : "border-white/10 bg-white/[0.03]"
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
          Más elegido
        </span>
      )}
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="mt-2 text-sm text-slate-400">{tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        {price > 0 ? (
          <>
            <span className="text-4xl font-bold text-white">{formatCurrency(price)}</span>
            <span className="text-sm text-slate-400">/mes</span>
          </>
        ) : (
          <span className="text-3xl font-bold text-white">Personalizado</span>
        )}
      </div>

      <ul className="mt-8 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={cn("mt-8 w-full text-center", featured ? "btn-primary" : "btn-secondary")}
      >
        {price > 0 ? "Empezar ahora" : "Hablar con ventas"}
      </Link>
    </div>
  );
}
