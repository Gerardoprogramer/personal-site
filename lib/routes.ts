// Relative imports: next.config.ts loads this file through lib/redirects.ts.
import { projects, type ProjectSlug } from "../content/projects";
import type { Language } from "./i18n/lang";

// The site's pages, independent of language. Every internal link, the language
// switcher, the sitemap and the metadata build their URLs from a RouteKey.
export type RouteKey =
  | { page: "home" }
  | { page: "project"; slug: ProjectSlug }
  | { page: "privacy" };

export const LANGUAGES: readonly Language[] = ["es", "en"];

// Translated path segments. Project slugs are proper names and stay the same
// in both languages.
export const SEGMENTS = {
  project: { es: "proyectos", en: "projects" },
  privacy: { es: "privacidad", en: "privacy" },
} as const satisfies Record<string, Record<Language, string>>;

export const PROJECT_SLUGS: readonly ProjectSlug[] = projects.map(
  (project) => project.slug,
);

export function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}

export function isProjectSlug(value: unknown): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly unknown[]).includes(value);
}

// Every page in every language, for the sitemap and the tests.
export function allRoutes(): RouteKey[] {
  return [
    { page: "home" },
    ...PROJECT_SLUGS.map((slug) => ({ page: "project" as const, slug })),
    { page: "privacy" },
  ];
}

// Path of a page in one language, without a trailing slash: "/es",
// "/en/projects/libra", "/es/privacidad".
export function pathFor(route: RouteKey, lang: Language): string {
  switch (route.page) {
    case "home":
      return `/${lang}`;
    case "project":
      return `/${lang}/${SEGMENTS.project[lang]}/${route.slug}`;
    case "privacy":
      return `/${lang}/${SEGMENTS.privacy[lang]}`;
  }
}

// Inverse of pathFor. Returns null for any path that is not a page of the
// site, including a segment in the other language ("/en/proyectos/libra").
export function parsePath(
  pathname: string,
): { lang: Language; route: RouteKey } | null {
  const parts = pathname.split("/").filter(Boolean);
  const [lang, segment, slug, ...rest] = parts;
  if (!isLanguage(lang) || rest.length > 0) return null;
  if (segment === undefined) return { lang, route: { page: "home" } };
  if (segment === SEGMENTS.privacy[lang] && slug === undefined) {
    return { lang, route: { page: "privacy" } };
  }
  if (segment === SEGMENTS.project[lang] && isProjectSlug(slug)) {
    return { lang, route: { page: "project", slug } };
  }
  return null;
}

// URL of the same page under the old ?lang= scheme. Used only by the routes in
// app/(legacy), which keep linking to each other until stage 2 redirects them.
export function legacyPathFor(route: RouteKey, lang: Language): string {
  switch (route.page) {
    case "home":
      return `/?lang=${lang}`;
    case "project":
      return `/proyectos/${route.slug}?lang=${lang}`;
    case "privacy":
      return `/privacidad?lang=${lang}`;
  }
}
