import { SITE_URL } from "@/content/profile";
import type { Language } from "@/lib/i18n/lang";

export const LANGUAGES: Language[] = ["es", "en"];
export const DEFAULT_LANGUAGE: Language = "es";

// Absolute, canonical URL of a page in one language. `path` starts with "/".
export function localizedUrl(path: string, lang: Language) {
  return `${SITE_URL}${path}?lang=${lang}`;
}

// hreflang map shared by page metadata and the sitemap, so both always agree.
export function languageAlternates(path: string) {
  return {
    es: localizedUrl(path, "es"),
    en: localizedUrl(path, "en"),
    "x-default": localizedUrl(path, DEFAULT_LANGUAGE),
  };
}

export function ogLocale(lang: Language) {
  return lang === "es" ? "es_CR" : "en_US";
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
