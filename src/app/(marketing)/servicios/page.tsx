import { Target, Users, PenTool, BarChart3, Handshake, Megaphone, Search, Sparkles } from "lucide-react";
import { CTASection } from "@/components/marketing/CTASection";

const influencerServices = [
  {
    icon: Target,
    title: "Targeting inteligente",
    text: "Definimos hashtags, ubicaciones geográficas y cuentas de referencia para que tu perfil llegue a la audiencia correcta, no a cualquiera.",
  },
  {
    icon: Users,
    title: "Growth manager dedicado",
    text: "Un profesional acompaña tu cuenta, revisa métricas semanalmente y ajusta la estrategia según tus resultados.",
  },
  {
    icon: PenTool,
    title: "Optimización de perfil",
    text: "Bio, destacados y formato de contenido ajustados para maximizar la conversión de visitante a seguidor.",
  },
  {
    icon: BarChart3,
    title: "Reportes de crecimiento",
    text: "Dashboard con seguidores, nuevos seguidores por día, engagement rate y visitas al perfil.",
  },
];

const brandServices = [
  {
    icon: Handshake,
    title: "Matching con creadores",
    text: "Conectamos tu marca con influencers verificados y afines a tu categoría, audiencia y presupuesto.",
  },
  {
    icon: Megaphone,
    title: "Gestión integral de campañas",
    text: "Briefing, negociación, seguimiento de entregables y medición de resultados de principio a fin.",
  },
  {
    icon: Search,
    title: "Auditoría de audiencia",
    text: "Verificamos autenticidad y afinidad de la audiencia de cada creador antes de activar una campaña.",
  },
  {
    icon: Sparkles,
    title: "Crecimiento de marca propia",
    text: "También hacemos crecer la cuenta de tu marca con la misma estrategia de targeting que usamos con influencers.",
  },
];

function ServiceColumn({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: typeof influencerServices;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-3 max-w-xl text-slate-400">{description}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((s) => (
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
  );
}

export default function ServiciosPage() {
  return (
    <>
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
              Nuestros servicios
            </span>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
              Dos caminos, un mismo objetivo: crecimiento real
            </h1>
            <p className="mt-4 text-slate-400">
              Trabajamos con influencers que quieren crecer su comunidad y con marcas
              que buscan potenciar su presencia o lanzar campañas de influencer marketing.
            </p>
          </div>

          <div className="mt-20 space-y-20">
            <ServiceColumn
              title="Para influencers y creadores"
              description="Crecimiento orgánico dirigido a tu nicho, con un equipo humano detrás de cada estrategia."
              items={influencerServices}
            />
            <ServiceColumn
              title="Para marcas"
              description="Desde campañas puntuales con influencers hasta el crecimiento sostenido de tu propia cuenta."
              items={brandServices}
            />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
