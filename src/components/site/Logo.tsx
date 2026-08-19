import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-bold tracking-tight ${className ?? ""}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
        <Sparkles className="h-4 w-4 text-white" />
      </span>
      <span className="text-lg text-white">
        Acrecer<span className="text-gradient">Marketing</span>
      </span>
    </Link>
  );
}
