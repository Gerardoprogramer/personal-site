import { usePathname } from "next/navigation";
import { useTranslation, type Translations } from "@/lib/i18n/context";

// Home page sections in navigation order, shared by the header, the mobile
// dock and menu, and the footer.
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

export function useNavLinks() {
  const { t, language } = useTranslation();
  const pathname = usePathname();
  // On the home page a bare hash is enough; elsewhere link back to the home
  // page in the active language.
  const home = pathname === "/" ? "" : `/?lang=${language}`;
  const links = NAV_SECTIONS.map(({ id, labelKey }) => ({
    id,
    href: `${home}#${id}`,
    label: t.header[labelKey],
  }));
  return { home, links };
}
