import { Users, Target, ShieldCheck, Globe2 } from "lucide-react";
import { CTASection } from "@/components/marketing/CTASection";

const values = [
  {
    icon: ShieldCheck,
    title: "Crecimiento sin atajos",
    text: "Nunca usamos bots ni vendemos seguidores falsos. Todo el crecimiento es orgánico y verificable.",
  },
  {
    icon: Target,
    title: "Estrategia, no adivinanza",
    text: "Cada cuenta tiene un targeting propio, basado en datos de nicho, audiencia y competencia.",
  },
  {
    icon: Users,
    title: "Personas, no solo software",
    text: "Detrás de cada cuenta hay un growth manager real, disponible para ajustar la estrategia.",
  },
  {
    icon: Globe2,
    title: "Alcance regional",
    text: "Trabajamos con creadores y marcas de toda Latinoamérica y España.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
              Sobre AcrecerMarketing
            </span>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
              Ayudamos a creadores y marcas a crecer de forma honesta
            </h1>
            <p className="mt-4 text-slate-400">
              Nacimos porque muchos servicios de &ldquo;crecimiento&rdquo; prometían números
              pero entregaban seguidores falsos y cuentas suspendidas. Acrecer existe
              para hacerlo bien: audiencia real, estrategia clara y resultados que se
              sostienen en el tiempo.
            </p>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-10 sm:grid-cols-3">
            {[
              { value: "2.400+", label: "cuentas gestionadas" },
              { value: "38", label: "países atendidos" },
              { value: "4.8/5", label: "satisfacción promedio" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
