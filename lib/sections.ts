import type { Translations } from "./i18n/context";
import { parsePath } from "./routes";

// Top of the home page: the hero, which has no entry in the navigation.
export const TOP_SECTION = "top";

// Home page sections in navigation order, shared by the header, the mobile
// dock and menu, the footer and the active-section indicator.
export const NAV_SECTIONS = [
  { id: "proyectos", labelKey: "projects" },
  { id: "experiencia", labelKey: "experience" },
  { id: "sobre-mi", labelKey: "about" },
  { id: "stack", labelKey: "stack" },
  { id: "servicios", labelKey: "services" },
  { id: "contacto", labelKey: "contact" },
] as const satisfies readonly {
  id: string;
  labelKey: keyof Translations["header"];
}[];

export type NavSectionId = (typeof NAV_SECTIONS)[number]["id"];

// Every element the indicator watches while the home page scrolls.
export const SECTION_IDS: readonly string[] = [
  TOP_SECTION,
  ...NAV_SECTIONS.map((section) => section.id),
];

// Which kind of page a pathname is, as far as the navigation cares: the home
// page (sections scroll), a case study (always "proyectos") or neither.
// Covers the /es and /en routes and, while app/(legacy) exists, the old ones.
export function sectionPage(pathname: string): "home" | "project" | null {
  const parsed = parsePath(pathname);
  if (parsed) {
    return parsed.route.page === "privacy" ? null : parsed.route.page;
  }
  if (pathname === "/") return "home";
  if (pathname.startsWith("/proyectos/")) return "project";
  return null;
}

// The section the navigation marks as current. `scrolled` is the section at
// the reading line, which only counts on the home page.
export function getActiveSection(
  pathname: string,
  scrolled: string,
): string | null {
  const page = sectionPage(pathname);
  if (page === "project") return "proyectos";
  return page === "home" ? scrolled : null;
}
