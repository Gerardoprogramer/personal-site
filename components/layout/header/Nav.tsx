"use client";

import { useEffect, useRef, useState } from "react";
import { useNavLinks } from "@/hooks/use-nav-links";

function NavLink({ href, label, index, onHover, onLeave }: {
  href: string; label: string; index: number; onHover: (el: HTMLElement) => void; onLeave: () => void;
}) {
  return (
    <a
      href={href}
      data-nav-link={href}
      onMouseEnter={(e) => onHover(e.currentTarget)}
      onMouseLeave={onLeave}
      className="relative flex items-center gap-1.5 px-3 py-2 transition-colors duration-150 hover:text-foreground"
    >
      <span className="text-[9px] text-primary/40">
        {String(index + 1).padStart(2, "0")}
      </span>
      {label}
    </a>
  );
}

export const Nav = () => {
  const links = useNavLinks();
  const navRef = useRef<HTMLUListElement>(null);
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoverIndicator, setHoverIndicator] = useState<{ left: number; width: number } | null>(null);

useEffect(() => {
  const sections = links
    .map((l) => document.querySelector(l.href))
    .filter(Boolean) as Element[];

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((e) => e.isIntersecting);

      if (!visible || !navRef.current) {
        setActiveIndicator((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const activeLink = navRef.current.querySelector(
        `[data-nav-link="#${visible.target.id}"]`
      ) as HTMLElement | null;

      if (activeLink) {
        setActiveIndicator({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          opacity: 1,
        });
      }
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
  return () => observer.disconnect();
}, [links]);

  const handleHover = (el: HTMLElement) => {
    setHoverIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  };

  const indicator = hoverIndicator ?? activeIndicator;
  const showIndicator = hoverIndicator !== null || activeIndicator.opacity === 1;

  return (
    <nav aria-label="Navegación principal" className="hidden md:block">
      <ul ref={navRef} className="relative flex items-center gap-1 font-mono-tech text-xs text-muted-foreground">
        {links.map((l, i) => (
          <li key={l.href}>
            <NavLink
              href={l.href}
              label={l.label}
              index={i}
              onHover={handleHover}
              onLeave={() => setHoverIndicator(null)}
            />
          </li>
        ))}
        <span
          className="pointer-events-none absolute bottom-0 h-px bg-primary transition-all duration-300 ease-out"
          style={{
            left: indicator.left + 12,
            width: indicator.width - 24,
            opacity: showIndicator ? 1 : 0,
            boxShadow: "0 0 8px var(--color-primary)",
          }}
        />
      </ul>
    </nav>
  );
};