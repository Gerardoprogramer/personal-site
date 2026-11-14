// Stage 2 redirects from the old ?lang= URLs to the /es and /en routes. All of
// them are temporary (307) until production confirms the new routes; stage 3
// decides whether some become permanent.
//
// Imports stay relative (no "@/" alias) because next.config.ts loads this file.
import type { Language } from "./i18n/lang";
import {
  LANGUAGES,
  PROJECT_SLUGS,
  SEGMENTS,
  isLanguage,
  isProjectSlug,
  pathFor,
  type RouteKey,
} from "./routes";

export const DEFAULT_LANGUAGE: Language = "es";
export const LANGUAGE_COOKIE = "language";

// First supported language in an Accept-Language header, by quality. Entries
// with q=0, "*" and any other language are ignored. Ties keep header order.
export function languageFromAcceptLanguage(
  header: string | null | undefined,
): Language | null {
  if (!header) return null;
  const candidates = header
    .split(",")
    .map((entry, index) => {
      const [tag, ...params] = entry.trim().split(";");
      const qParam = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const q = qParam === undefined ? 1 : Number(qParam.slice(2));
      const primary = tag.trim().toLowerCase().split("-")[0];
      return { primary, q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((c) => c.q > 0 && isLanguage(c.primary))
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return (candidates[0]?.primary as Language | undefined) ?? null;
}

// Language for a URL that does not say it: the cookie the language switcher
// writes, then the browser's Accept-Language, then Spanish. No IP lookup.
export function negotiateLanguage(
  cookie: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Language {
  if (isLanguage(cookie)) return cookie;
  return languageFromAcceptLanguage(acceptLanguage) ?? DEFAULT_LANGUAGE;
}

// The page an old URL shows, or null if the path is not one of the old pages
// (including /proyectos/<unknown slug>, which keeps its 404).
export function legacyRoute(pathname: string): RouteKey | null {
  if (pathname === "/") return { page: "home" };
  if (pathname === "/privacidad") return { page: "privacy" };
  const match = /^\/proyectos\/([^/]+)$/.exec(pathname);
  if (match && isProjectSlug(match[1])) {
    return { page: "project", slug: match[1] };
  }
  return null;
}

export type LegacyRedirect = {
  // Path and query of the new URL. The browser keeps the #hash.
  location: string;
  lang: Language;
  // True when the language came from the cookie or Accept-Language, so the
  // response varies per visitor and must not be cached by a CDN.
  negotiated: boolean;
};

// Where an old URL redirects to, or null if it does not redirect. Drops every
// `lang` parameter and keeps the rest of the query (utm_*, etc.). An invalid
// ?lang= counts as missing.
export function legacyRedirect(input: {
  pathname: string;
  search: string;
  cookie?: string | null;
  acceptLanguage?: string | null;
}): LegacyRedirect | null {
  const route = legacyRoute(input.pathname);
  if (!route) return null;

  const params = new URLSearchParams(input.search);
  const requested = params.get("lang");
  params.delete("lang");

  const negotiated = !isLanguage(requested);
  const lang = isLanguage(requested)
    ? requested
    : negotiateLanguage(input.cookie, input.acceptLanguage);

  const query = params.toString();
  return {
    location: `${pathFor(route, lang)}${query ? `?${query}` : ""}`,
    lang,
    negotiated,
  };
}

const slugPattern = PROJECT_SLUGS.map((slug) =>
  slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");

// A translated segment under the wrong language prefix ("/en/proyectos/libra",
// "/es/privacy") goes to the same page in the language of the prefix. For
// next.config.ts redirects(): static, independent of cookies, 307. Unknown
// slugs do not match and keep their 404. Next.js passes the request query
// through, so a ?lang= the visitor added stays in the URL; the prefix decides
// the language and the proxy does not run on /es or /en, so it cannot loop.
export function crossLanguageRedirects() {
  return LANGUAGES.flatMap((lang) => {
    const other: Language = lang === "es" ? "en" : "es";
    return [
      {
        source: `/${lang}/${SEGMENTS.project[other]}/:slug(${slugPattern})`,
        destination: `/${lang}/${SEGMENTS.project[lang]}/:slug`,
        permanent: false,
      },
      {
        source: `/${lang}/${SEGMENTS.privacy[other]}`,
        destination: `/${lang}/${SEGMENTS.privacy[lang]}`,
        permanent: false,
      },
    ];
  });
}
