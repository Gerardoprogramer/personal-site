import { MetadataRoute } from "next";
import { LANGUAGES, languageAlternates, localizedUrl } from "@/lib/seo";
import { allRoutes, type RouteKey } from "@/lib/routes";

type Entry = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">;

const entries: Record<RouteKey["page"], Entry> = {
  home: { changeFrequency: "monthly", priority: 1 },
  project: { changeFrequency: "monthly", priority: 0.8 },
  privacy: { changeFrequency: "yearly", priority: 0.2 },
};

// One entry per page and language: each <loc> is that page's /es or /en URL.
// The site root is left out: it is only the x-default of every page.
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().flatMap((route) =>
    LANGUAGES.map((lang) => ({
      url: localizedUrl(route, lang),
      ...entries[route.page],
      alternates: { languages: languageAlternates(route) },
    })),
  );
}
