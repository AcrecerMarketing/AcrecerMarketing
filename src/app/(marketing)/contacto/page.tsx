import { Mail, MessageCircle, MapPin } from "lucide-react";
import { ContactForm } from "@/components/marketing/ContactForm";

export default function ContactoPage() {
  return (
    <section className="py-20">
      <div className="container-page grid gap-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
            Hablemos
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
            Cuéntanos sobre tu marca o cuenta
          </h1>
          <p className="mt-4 max-w-md text-slate-400">
            Ya seas un creador buscando crecer o una marca lista para lanzar una
            campaña de influencer marketing, nuestro equipo te ayuda a definir
            la estrategia correcta.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="text-sm text-slate-400">hola@acrecermarketing.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Soporte para clientes</p>
                <p className="text-sm text-slate-400">Chat en vivo desde tu dashboard</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-300">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Presencia</p>
                <p className="text-sm text-slate-400">Equipo remoto en Latinoamérica y España</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
