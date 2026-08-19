import Link from "next/link";
import { ArrowRight, TrendingUp, Users2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 md:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-brand-gradient-soft blur-3xl"
      />

      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
            <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
            +2.400 cuentas en crecimiento activo
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Crecimiento real en Instagram
            <span className="text-gradient"> para influencers y marcas</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            Targeting inteligente, growth managers dedicados y campañas de
            influencer marketing. Sin bots, sin seguidores falsos: audiencia
            real, afín a tu nicho.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/registro" className="btn-primary">
              Empezar prueba gratuita
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/precios" className="btn-secondary">
              Ver planes y precios
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-brand-400" />
              Para influencers y creadores
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <TrendingUp className="h-4 w-4 text-brand-400" />
              Para marcas y campañas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
