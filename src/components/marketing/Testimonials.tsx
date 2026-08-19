import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Camila Rivas",
    handle: "@camila.creates",
    quote:
      "En 3 meses pasé de 8 mil a más de 21 mil seguidores reales. Lo mejor es que el engagement subió también, no solo el número.",
  },
  {
    name: "Diego Fernández",
    handle: "Fundador, Nordika Studio",
    quote:
      "El equipo de Acrecer gestionó nuestra campaña de influencers de lanzamiento. Resultados medibles y reportes claros cada semana.",
  },
  {
    name: "Valentina Ruiz",
    handle: "@valen.wellness",
    quote:
      "Mi growth manager entiende mi nicho. El targeting por hashtags y ubicación trajo justo a la audiencia que buscaba.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Creadores y marcas que ya están creciendo
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-300">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-6 text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-slate-500">{t.handle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
