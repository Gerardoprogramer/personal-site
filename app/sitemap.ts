import { MetadataRoute } from "next";

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
  ];
}