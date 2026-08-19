import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-brand-gradient-soft blur-3xl"
      />
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
