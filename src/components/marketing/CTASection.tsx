import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para acrecentar tu audiencia?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Únete a cientos de creadores y marcas que ya crecen con una estrategia
            real, medible y sin atajos.
          </p>
          <Link
            href="/registro"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:-translate-y-0.5 transition-transform"
          >
            Empezar prueba gratuita
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
