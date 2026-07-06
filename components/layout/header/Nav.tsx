"use client";

import { useNavLinks } from "@/hooks/use-nav-links";

export const Nav = () => {
  const links = useNavLinks();

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