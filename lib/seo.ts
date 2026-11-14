import { SITE_URL } from "@/content/profile";
import type { Language } from "@/lib/i18n/lang";
import { pathFor, type RouteKey } from "@/lib/routes";

export { LANGUAGES } from "@/lib/routes";
export const DEFAULT_LANGUAGE: Language = "es";

// Absolute, canonical URL of a page in one language: its /es or /en path. The
// legacy ?lang= pages use it too, so their canonical is the new URL.
export function localizedUrl(route: RouteKey, lang: Language) {
  return `${SITE_URL}${pathFor(route, lang)}`;
}

// The site root picks the language (cookie, otherwise Spanish), so it is the
// x-default of every page.
export const X_DEFAULT_URL = `${SITE_URL}/`;

// hreflang map shared by page metadata and the sitemap, so both always agree.
export function languageAlternates(route: RouteKey) {
  return {
    es: localizedUrl(route, "es"),
    en: localizedUrl(route, "en"),
    "x-default": X_DEFAULT_URL,
  };
}

export function ogLocale(lang: Language) {
  return lang === "es" ? "es_CR" : "en_US";
}

export function otherLanguage(lang: Language): Language {
  return lang === "es" ? "en" : "es";
}

// Role in the visitor's language, shared by the Open Graph alt text and the
// Person JSON-LD so neither mixes languages.
export function jobTitle(lang: Language) {
  return lang === "es" ? "Desarrollador Full Stack" : "Full Stack Developer";
}

export function defaultOgImageAlt(lang: Language) {
  return `Gerardo Martínez Monge - ${jobTitle(lang)}`;
}

export function defaultOgImage(lang: Language) {
  return `/og-image${lang === "en" ? "-en" : ""}.png?v=portfolio-2`;
}
