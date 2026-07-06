"use client";

import { useTranslation } from "@/lib/i18n/context";

export const Nav = () => {
  const { t } = useTranslation();

  const links = [
    { href: "#proyectos", label: t.nav.proyectos },
    { href: "#servicios", label: t.nav.servicios },
    { href: "#stack", label: t.nav.stack },
    { href: "#experiencia", label: t.nav.experiencia },
    { href: "#contacto", label: t.nav.contacto },
  ];

  return (
    <nav aria-label="Navegación principal" className="hidden md:block">
      <ul className="flex items-center gap-6 font-mono-tech text-xs text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="transition-colors hover:text-primary">
              {`// ${l.label}`}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};