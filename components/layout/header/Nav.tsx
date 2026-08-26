"use client";

import { useEffect, useRef, useState } from "react";

import { FiFolder, FiTool, FiLayers, FiBriefcase, FiMail, FiCircle } from "react-icons/fi";

import { useNavLinks } from "@/hooks/use-nav-links";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  projects: FiFolder,
  proyectos: FiFolder,
  services: FiTool,
  servicios: FiTool,
  stack: FiLayers,
  experience: FiBriefcase,
  experiencia: FiBriefcase,
  contact: FiMail,
  contacto: FiMail,
};

function getIcon(label: string) {
  return ICONS[label.trim().toLowerCase()] ?? FiCircle;
}

function NavLink({
  href,
  label,
  onHover,
  onLeave,
}: {
  href: string;
  label: string;
  onHover: (el: HTMLElement) => void;
  onLeave: () => void;
}) {
  return (
    <a
      href={href}
      data-nav-link={href}
      onMouseEnter={(e) => onHover(e.currentTarget)}
      onMouseLeave={onLeave}
      className="relative flex items-center px-3 py-2 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
    >
      {label}
    </a>
  );
}

interface NavProps {
  mobile?: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}

export const Nav = ({
  mobile = false,
  compact = false,
  onNavigate,
}: NavProps) => {
  const links = useNavLinks();

  const navRef = useRef<HTMLUListElement>(null);

  const [activeHref, setActiveHref] = useState<string | null>(null);

  const [activeIndicator, setActiveIndicator] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [hoverIndicator, setHoverIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);

        if (!visible) {
          setActiveIndicator((prev) => ({
            ...prev,
            opacity: 0,
          }));

          setActiveHref(null);

          return;
        }

        const href = `#${visible.target.id}`;

        setActiveHref(href);

        if (!navRef.current) return;

        const activeLink = navRef.current.querySelector(
          `[data-nav-link="${href}"]`
        ) as HTMLElement | null;

        if (activeLink) {
          setActiveIndicator({
            left: activeLink.offsetLeft,
            width: activeLink.offsetWidth,
            opacity: 1,
          });
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
      }
    );

    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [links]);

  const handleHover = (el: HTMLElement) => {
    setHoverIndicator({
      left: el.offsetLeft,
      width: el.offsetWidth,
    });
  };

  if (mobile || compact) {
    return (
      <nav aria-label="Navegación principal">
        <ul className="flex items-center justify-between gap-1">
          {links.map((l) => {
            const isActive = activeHref === l.href;
            const Icon = getIcon(l.label);

            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-nav-link={l.href}
                  aria-label={l.label}
                  title={l.label}
                  onClick={onNavigate}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ${isActive
                    ? "bg-accent/15 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  /*
   * DESKTOP
   *
   * Este es tu nav original con texto e indicador.
   */
  const indicator = hoverIndicator ?? activeIndicator;

  const showIndicator =
    hoverIndicator !== null || activeIndicator.opacity === 1;

  return (
    <nav aria-label="Navegación principal">
      <div className="relative">
        <ul ref={navRef} className="flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <NavLink
                href={l.href}
                label={l.label}
                onHover={handleHover}
                onLeave={() => setHoverIndicator(null)}
              />
            </li>
          ))}
        </ul>

        <span
          className="pointer-events-none absolute bottom-0 h-px bg-accent transition-all duration-300 ease-out"
          style={{
            left: indicator.left + 12,
            width: indicator.width - 24,
            opacity: showIndicator ? 1 : 0,
          }}
        />
      </div>
    </nav>
  );
};