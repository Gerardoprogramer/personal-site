import { useTranslation } from "@/lib/i18n/context";

export function useNavLinks() {
  const { t } = useTranslation();

  return [
    { href: "#proyectos", label: t.nav.proyectos },
    { href: "#servicios", label: t.nav.servicios },
    { href: "#stack", label: t.nav.stack },
    { href: "#experiencia", label: t.nav.experiencia },
    { href: "#contacto", label: t.nav.contacto },
  ] as const;
}