import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { NAV_SECTIONS } from "@/lib/sections";

export function useNavLinks() {
  const { t, href, homePath } = useTranslation();
  const pathname = usePathname();
  // On the home page a bare hash is enough; elsewhere link back to the home
  // page in the active language.
  const home = pathname === homePath ? "" : href({ page: "home" });
  const links = NAV_SECTIONS.map(({ id, labelKey }) => ({
    id,
    href: `${home}#${id}`,
    label: t.header[labelKey],
  }));
  return { home, links };
}
