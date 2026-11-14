"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { parsePath, pathFor, type RouteKey } from "@/lib/routes";

const LANGS = ["es", "en"] as const;

function className(active: boolean) {
  return `min-h-10 min-w-10 rounded-full transition-colors ${active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`;
}

export function LanguageSwitcher() {
  const { routing } = useTranslation();
  return routing === "path" ? <PathSwitcher /> : <LegacySwitcher />;
}

// app/(legacy): buttons that switch ?lang= in place.
function LegacySwitcher() {
  const { language, setLanguage, t } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t.nav.languageSwitcher}
      className="flex rounded-full border border-border p-0.5 font-mono-tech text-xs"
    >
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={className(language === lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// app/[lang]: links to the same page in each language, so crawlers and
// visitors without JavaScript can follow them. The click also stores the
// choice in the language cookie and keeps the current #section.
function PathSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const route: RouteKey = parsePath(pathname)?.route ?? { page: "home" };

  const onClick = (
    event: MouseEvent<HTMLAnchorElement>,
    lang: (typeof LANGS)[number],
    href: string,
  ) => {
    setLanguage(lang);
    const hash = window.location.hash;
    if (!hash || lang === language) return;
    event.preventDefault();
    router.push(`${href}${hash}`);
  };

  return (
    <div
      role="group"
      aria-label={t.nav.languageSwitcher}
      className="flex rounded-full border border-border p-0.5 font-mono-tech text-xs"
    >
      {LANGS.map((lang) => {
        const href = pathFor(route, lang);
        return (
          <Link
            key={lang}
            href={href}
            hrefLang={lang}
            lang={lang}
            onClick={(event) => onClick(event, lang, href)}
            aria-current={language === lang ? "page" : undefined}
            className={`inline-flex items-center justify-center ${className(language === lang)}`}
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
