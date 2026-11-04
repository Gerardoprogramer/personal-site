import { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { LANGUAGES, languageAlternates, localizedUrl } from "@/lib/seo";

type Page = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & {
  path: string;
};

const pages: Page[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  ...projects.map((project) => ({
    path: `/proyectos/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.2 },
];

// One entry per page and language: each <loc> is that page's canonical URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, ...entry }) =>
    LANGUAGES.map((lang) => ({
      url: localizedUrl(path, lang),
      ...entry,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
