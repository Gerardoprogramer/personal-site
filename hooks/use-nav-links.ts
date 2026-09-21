import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

export function useNavLinks() {
  const { t, language } = useTranslation();
  const pathname = usePathname();
  const home = pathname === "/" ? "" : `/?lang=${language}`;
  return [
    { href: `${home}#proyectos`, label: t.nav.proyectos },
    { href: `${home}#experiencia`, label: t.nav.experiencia },
    { href: `${home}#servicios`, label: t.nav.servicios },
    { href: `${home}#contacto`, label: t.nav.contacto },
  ];
}
