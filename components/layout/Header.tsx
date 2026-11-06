"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import type { IconType } from "react-icons";
import { useTranslation } from "@/lib/i18n/context";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useNavLinks, type NavSectionId } from "@/hooks/use-nav-links";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { SocialLinks } from "./header/SocialLinks";
import { Logo } from "./header/Logo";
import { cvHref, socials } from "@/content/portfolio";

const SECTION_ICONS: Record<NavSectionId, IconType> = {
  proyectos: FiGrid,
  experiencia: FiBriefcase,
  "sobre-mi": FiUser,
  stack: FiGrid,
  servicios: FiBriefcase,
  contacto: FiMail,
};

export function Header() {
  const { language, t } = useTranslation();
  const active = useActiveSection();
  const menu = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { home, links: sections } = useNavLinks();
  const links = sections.map((section) => ({
    ...section,
    Icon: SECTION_ICONS[section.id],
  }));
  const dockLinks = links.filter((link) =>
    ["proyectos", "experiencia", "sobre-mi", "contacto"].includes(link.id),
  );

  useEffect(() => {
    // Same breakpoint as the desktop navigation in app/globals.css.
    const desktop = window.matchMedia("(min-width: 1024px)");
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
            aria-label={t.header.mainNav}
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
        aria-label={t.header.mobileNav}
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
          <span>{t.header.menu}</span>
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
                {t.header.menuEyebrow}
              </p>
              <h2 id="site-menu-title" className="font-display text-3xl">
                {t.header.menuTitle}
              </h2>
            </div>
            <button
              autoFocus
              type="button"
              onClick={() => menu.current?.close()}
              aria-label={t.header.closeMenu}
              className="sheet-close"
            >
              <FiX aria-hidden="true" className="size-5" />
            </button>
          </div>
          <nav
            aria-label={t.header.allSections}
            className="sheet-navigation"
          >
            <Link
              href={`${home}#top`}
              onClick={() => menu.current?.close()}
              className="sheet-nav-link"
            >
              <span className="sheet-letter">G</span>
              <span>{t.header.home}</span>
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
              {t.header.connect}
            </p>
            <SocialLinks expanded />
            <a
              href={cvHref(language)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <FiDownload aria-hidden="true" />
              {t.common.viewResume}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
