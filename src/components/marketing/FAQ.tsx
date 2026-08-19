"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "¿Usan bots o compran seguidores falsos?",
    a: "No. Nuestro crecimiento es 100% orgánico: growth managers y targeting inteligente atraen personas reales interesadas en tu contenido.",
  },
  {
    q: "¿Necesitan la contraseña de mi Instagram?",
    a: "No pedimos contraseñas. Trabajamos con tu equipo para ejecutar la estrategia de targeting y contenido de forma segura.",
  },
  {
    q: "¿Cuánto tarda en verse crecimiento?",
    a: "La mayoría de las cuentas empieza a ver resultados en las primeras dos semanas, con crecimiento sostenido a partir del primer mes.",
  },
  {
    q: "¿Puedo cambiar de plan más adelante?",
    a: "Sí, puedes subir o bajar de plan cuando quieras desde tu panel de facturación, sin penalidades.",
  },
  {
    q: "¿Trabajan con marcas además de influencers?",
    a: "Sí. Ofrecemos planes específicos para marcas que buscan crecer su propia cuenta o gestionar campañas con creadores.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Preguntas frecuentes</h2>
        </div>

        <div className="mx-auto mt-12 max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10">
          {faqs.map((item, i) => (
            <div key={item.q} className="p-5">
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-white">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              {openIndex === i && (
                <p className="mt-3 text-sm text-slate-400">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
