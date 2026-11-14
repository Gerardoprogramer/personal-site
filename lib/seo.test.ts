import { beforeEach, describe, expect, it, vi } from "vitest";

let language = "es";
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-language": language }),
}));

const { SITE_URL } = await import("@/content/profile");
const { languageAlternates, localizedUrl } = await import("./seo");
const { default: sitemap } = await import("@/app/sitemap");
const { default: robots } = await import("@/app/robots");
const privacy = await import("@/app/privacidad/page");
const project = await import("@/app/proyectos/[slug]/page");
const notFound = await import("@/app/not-found");

const ORIGIN = "https://www.gerardomartinez.dev";

beforeEach(() => {
  language = "es";
});

describe("canonical domain", () => {
  it("uses the www host that production serves", () => {
    expect(SITE_URL).toBe(ORIGIN);
  });
});

describe("languageAlternates", () => {
  it("links both languages and points x-default to Spanish", () => {
    expect(languageAlternates("/privacidad")).toEqual({
      es: `${ORIGIN}/privacidad?lang=es`,
      en: `${ORIGIN}/privacidad?lang=en`,
      "x-default": `${ORIGIN}/privacidad?lang=es`,
    });
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("lists one canonical URL per page and language", () => {
    expect(entries.map((e) => e.url)).toEqual([
      `${ORIGIN}/?lang=es`,
      `${ORIGIN}/?lang=en`,
      `${ORIGIN}/proyectos/libra?lang=es`,
      `${ORIGIN}/proyectos/libra?lang=en`,
      `${ORIGIN}/proyectos/la-central?lang=es`,
      `${ORIGIN}/proyectos/la-central?lang=en`,
      `${ORIGIN}/proyectos/obsidian-library?lang=es`,
      `${ORIGIN}/proyectos/obsidian-library?lang=en`,
      `${ORIGIN}/proyectos/selvatica?lang=es`,
      `${ORIGIN}/proyectos/selvatica?lang=en`,
      `${ORIGIN}/privacidad?lang=es`,
      `${ORIGIN}/privacidad?lang=en`,
    ]);
  });

  it("includes every entry inside its own hreflang set", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.values(languages)).toContain(entry.url);
      expect(Object.keys(languages).sort()).toEqual(["en", "es", "x-default"]);
    }
  });
});

describe("robots.txt", () => {
  it("references the www sitemap", () => {
    expect(robots().sitemap).toBe(`${ORIGIN}/sitemap.xml`);
  });
});

describe("privacy metadata", () => {
  it.each(["es", "en"])("has its own canonical and Open Graph in %s", async (lang) => {
    language = lang;
    const meta = await privacy.generateMetadata();
    const url = `${ORIGIN}/privacidad?lang=${lang}`;

    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.alternates?.languages).toEqual(languageAlternates("/privacidad"));
    expect(meta.openGraph).toMatchObject({ url, description: meta.description });
    expect(String(meta.openGraph?.title)).toContain(String(meta.title));
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("project metadata", () => {
  it.each(["es", "en"])("uses the canonical URL for %s", async (lang) => {
    language = lang;
    const meta = await project.generateMetadata({
      params: Promise.resolve({ slug: "la-central" }),
    });
    const url = localizedUrl("/proyectos/la-central", lang as "es" | "en");

    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.alternates?.languages).toEqual(languageAlternates("/proyectos/la-central"));
    expect(meta.openGraph?.url).toBe(url);
  });
});

describe("not-found metadata", () => {
  it.each(["es", "en"])("is noindex and drops inherited SEO tags in %s", async (lang) => {
    language = lang;
    const meta = await notFound.generateMetadata();

    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.alternates).toBeNull();
    expect(meta.openGraph).toBeNull();
    expect(meta.twitter).toBeNull();
    expect(meta.title).toBe(lang === "es" ? "Página no encontrada" : "Page not found");
  });
});
