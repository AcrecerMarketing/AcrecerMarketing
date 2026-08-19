import Link from "next/link";
import { Instagram, Music2, Twitter } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Crecimiento orgánico y campañas de influencer marketing para creadores
            y marcas que quieren resultados reales, no números vacíos.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Music2, Twitter].map((Icon, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Producto</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/servicios" className="hover:text-white">Servicios</Link></li>
            <li><Link href="/precios" className="hover:text-white">Precios</Link></li>
            <li><Link href="/registro" className="hover:text-white">Crear cuenta</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Compañía</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><span className="cursor-default">Términos de servicio</span></li>
            <li><span className="cursor-default">Política de privacidad</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="container-page text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AcrecerMarketing. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
