"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { href: "/servicios", label: "Servicios" },
  { href: "/precios", label: "Precios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="btn-ghost text-sm">
            Iniciar sesión
          </Link>
          <Link href="/registro" className="btn-primary text-sm">
            Empezar ahora
          </Link>
        </div>

        <button
          className="p-2 text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-ink-950 px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-300"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <Link href="/login" className="btn-secondary w-full text-sm">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="btn-primary w-full text-sm">
                Empezar ahora
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
