import { UserPlus, Sliders, Rocket, LineChart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Cuéntanos tu marca",
    text: "Regístrate y comparte tu cuenta de Instagram, tu nicho y tus objetivos de crecimiento.",
  },
  {
    icon: Sliders,
    title: "Configuramos el targeting",
    text: "Definimos hashtags, ubicaciones y cuentas competidoras junto a tu growth manager.",
  },
  {
    icon: Rocket,
    title: "Empieza el crecimiento",
    text: "Nuestro equipo activa la estrategia y atrae seguidores reales, afines a tu audiencia.",
  },
  {
    icon: LineChart,
    title: "Sigue tus resultados",
    text: "Monitorea seguidores, engagement y alcance desde tu dashboard, en tiempo real.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Cómo funciona</h2>
          <p className="mt-4 text-slate-400">
            Un proceso simple, transparente y sin sorpresas — de cero a crecimiento
            sostenido en días, no meses.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
                <step.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-semibold text-brand-400">PASO {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
