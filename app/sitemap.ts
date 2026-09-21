import { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const SITE_URL = "https://gerardomartinez.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          es: `${SITE_URL}/?lang=es`,
          en: `${SITE_URL}/?lang=en`,
        },
      },
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/proyectos/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          es: `${SITE_URL}/proyectos/${project.slug}?lang=es`,
          en: `${SITE_URL}/proyectos/${project.slug}?lang=en`,
        },
      },
    })),
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
