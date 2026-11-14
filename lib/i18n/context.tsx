"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import es from "./es.json";
import en from "./en.json";
import type { Language } from "./lang";
import { legacyPathFor, pathFor, type RouteKey } from "@/lib/routes";

export type { Language };
export type Translations = typeof es;
const translations: Record<Language, Translations> = { es, en };

// "legacy": the language comes from ?lang= or the cookie, and links use ?lang=
// (app/(legacy), temporary). "path": the language is the /es or /en segment,
// and links use the translated paths (app/[lang]).
export type Routing = "legacy" | "path";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  routing: Routing;
  // Link to a page in the active language, in the scheme of the current
  // routes, so neither group links into the other.
  href: (route: RouteKey) => string;
  // Pathname of the home page in the current scheme.
  homePath: string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function writeLanguageCookie(lang: Language) {
  document.cookie = `language=${lang}; path=/; max-age=31536000`;
}

function useDocumentLanguage(language: Language) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
}

// Routes in app/(legacy): reads ?lang= and switches language in place.
export function LegacyLanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: Language;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedLang = searchParams.get("lang");
  const language: Language =
    requestedLang === "es" || requestedLang === "en"
      ? requestedLang
      : initialLang;

  const setLanguage = (lang: Language) => {
    writeLanguageCookie(lang);

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.replace(`${pathname}?${params.toString()}${window.location.hash}`, {
      scroll: false,
    });
  };

  useDocumentLanguage(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        routing: "legacy",
        href: (route) => legacyPathFor(route, language),
        homePath: "/",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Routes in app/[lang]: the language is fixed by the URL segment. Switching
// language means navigating to the same page under the other segment, which
// the language switcher does with links.
export function LanguageProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Language;
}) {
  useDocumentLanguage(lang);

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        setLanguage: writeLanguageCookie,
        t: translations[lang],
        routing: "path",
        href: (route) => pathFor(route, lang),
        homePath: pathFor({ page: "home" }, lang),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useTranslation debe usarse dentro de LanguageProvider");
  return ctx;
}
