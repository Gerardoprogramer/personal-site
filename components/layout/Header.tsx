"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiGrid,
  FiMail,
  FiMenu,
  FiUser,
  FiX,
  FiDownload,
} from "react-icons/fi";
import { useTranslation } from "@/lib/i18n/context";
import { useActiveSection } from "@/hooks/useActiveSection";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { SocialLinks } from "./header/SocialLinks";
import { Logo } from "./header/Logo";
import { socials } from "@/content/portfolio";

export function Header() {
  const { language } = useTranslation();
  const pathname = usePathname();
  const active = useActiveSection();
  const menu = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const es = language === "es";
  const home = pathname === "/" ? "" : `/?lang=${language}`;
  const links = [
    { id: "proyectos", label: es ? "Proyectos" : "Projects", Icon: FiGrid },
    {
      id: "experiencia",
      label: es ? "Experiencia" : "Experience",
      Icon: FiBriefcase,
    },
    { id: "sobre-mi", label: es ? "Sobre mí" : "About", Icon: FiUser },
    { id: "stack", label: "Stack", Icon: FiGrid },
    {
      id: "servicios",
      label: es ? "Servicios" : "Services",
      Icon: FiBriefcase,
    },
    { id: "contacto", label: es ? "Contacto" : "Contact", Icon: FiMail },
  ];
  const dockLinks = links.filter((link) =>
    ["proyectos", "experiencia", "sobre-mi", "contacto"].includes(link.id),
  );

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1120px)");
    const closeOnDesktop = () => {
      if (desktop.matches) menu.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function openMenu() {
    menu.current?.showModal();
    setMenuOpen(true);
  }

  return (
    <>
      <header className="site-header">
        <div className="header-bar">
          <Logo />
          <nav
            aria-label={es ? "Navegación principal" : "Main navigation"}
            className="desktop-nav"
          >
            {links.map((link) => (
              <Link
                key={link.id}
                href={`${home}#${link.id}`}
                aria-current={active === link.id ? "location" : undefined}
                className="desktop-nav-link"
              >
                {link.label}
                <span className="nav-active-dot" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="header-utilities">
            <SocialLinks />
            <span className="header-divider" aria-hidden="true" />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <nav
        aria-label={es ? "Navegación móvil" : "Mobile navigation"}
        className="mobile-dock"
      >
        {dockLinks.map(({ id, label, Icon }) => (
          <Link
            key={id}
            href={`${home}#${id}`}
            aria-current={active === id ? "location" : undefined}
            className="dock-link"
          >
            <Icon aria-hidden="true" className="size-[18px]" />
            <span>{label}</span>
          </Link>
        ))}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-controls="site-menu"
          aria-expanded={menuOpen}
          onClick={openMenu}
          className="dock-link dock-menu"
        >
          <FiMenu aria-hidden="true" className="size-[18px]" />
          <span>{es ? "Menú" : "Menu"}</span>
        </button>
      </nav>

      <dialog
        ref={menu}
        id="site-menu"
        aria-labelledby="site-menu-title"
        className="navigation-sheet"
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) menu.current?.close();
        }}
      >
        <div className="sheet-content">
          <div className="sheet-handle" aria-hidden="true" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow mb-1">
                {es ? "Explora el portfolio" : "Explore the portfolio"}
              </p>
              <h2 id="site-menu-title" className="font-display text-3xl">
                {es ? "Un poco más de mí." : "A little more about me."}
              </h2>
            </div>
            <button
              autoFocus
              type="button"
              onClick={() => menu.current?.close()}
              aria-label={es ? "Cerrar menú" : "Close menu"}
              className="sheet-close"
            >
              <FiX aria-hidden="true" className="size-5" />
            </button>
          </div>
          <nav
            aria-label={es ? "Todas las secciones" : "All sections"}
            className="sheet-navigation"
          >
            <Link
              href={`${home}#top`}
              onClick={() => menu.current?.close()}
              className="sheet-nav-link"
            >
              <span className="sheet-letter">G</span>
              <span>{es ? "Inicio" : "Home"}</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
            {links.map((link, index) => (
              <Link
                key={link.id}
                href={`${home}#${link.id}`}
                aria-current={active === link.id ? "location" : undefined}
                onClick={() => menu.current?.close()}
                className="sheet-nav-link"
              >
                <span className="sheet-letter">{"ERARDO"[index]}</span>
                <span>{link.label}</span>
                <FiArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="sheet-footer">
            <p className="eyebrow mb-3 text-muted-foreground">
              {es ? "Conectemos" : "Let’s connect"}
            </p>
            <SocialLinks expanded />
            <a
              href={socials.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <FiDownload aria-hidden="true" />
              {es ? "Ver currículum" : "View résumé"}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
