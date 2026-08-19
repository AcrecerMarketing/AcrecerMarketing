import { Target, Users, PenTool, BarChart3, Handshake, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Target,
    title: "Crecimiento orgánico dirigido",
    text: "Targeting por hashtags, ubicaciones y cuentas competidoras para atraer seguidores reales afines a tu nicho.",
  },
  {
    icon: Users,
    title: "Growth manager dedicado",
    text: "Un experto en crecimiento acompaña tu estrategia semana a semana, ajustando el targeting a tus resultados.",
  },
  {
    icon: Handshake,
    title: "Influencer marketing para marcas",
    text: "Conectamos tu marca con creadores verificados y gestionamos campañas de principio a fin.",
  },
  {
    icon: PenTool,
    title: "Estrategia de contenido",
    text: "Recomendaciones de formato, frecuencia y bio optimizada para maximizar conversión de perfil.",
  },
  {
    icon: BarChart3,
    title: "Reportes y analítica",
    text: "Dashboards con seguidores, engagement, alcance y visitas al perfil, actualizados en tiempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Crecimiento seguro",
    text: "Sin bots ni compra de seguidores falsos: cumplimos buenas prácticas para proteger tu cuenta.",
  },
];

export function ServicesGrid() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Servicios pensados para crecer con propósito
          </h2>
          <p className="mt-4 text-slate-400">
            Ya seas un creador de contenido o una marca, tenemos un servicio hecho
            a la medida de tus objetivos.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
