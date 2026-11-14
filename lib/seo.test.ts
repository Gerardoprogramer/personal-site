import { beforeEach, describe, expect, it, vi } from "vitest";

let language = "es";
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-language": language }),
}));

const { SITE_URL } = await import("@/content/profile");
const { languageAlternates, localizedUrl } = await import("./seo");
const { default: sitemap } = await import("@/app/sitemap");
const { default: robots } = await import("@/app/robots");
const privacy = await import("@/app/(legacy)/privacidad/page");
const project = await import("@/app/(legacy)/proyectos/[slug]/page");
const notFound = await import("@/app/(legacy)/not-found");

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
  it("links the translated paths and points x-default to the site root", () => {
    expect(languageAlternates({ page: "privacy" })).toEqual({
      es: `${ORIGIN}/es/privacidad`,
      en: `${ORIGIN}/en/privacy`,
      "x-default": `${ORIGIN}/`,
    });
    expect(languageAlternates({ page: "project", slug: "libra" })).toEqual({
      es: `${ORIGIN}/es/proyectos/libra`,
      en: `${ORIGIN}/en/projects/libra`,
      "x-default": `${ORIGIN}/`,
    });
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("lists one canonical URL per page and language", () => {
    expect(entries.map((e) => e.url)).toEqual([
      `${ORIGIN}/es`,
      `${ORIGIN}/en`,
      `${ORIGIN}/es/proyectos/libra`,
      `${ORIGIN}/en/projects/libra`,
      `${ORIGIN}/es/proyectos/la-central`,
      `${ORIGIN}/en/projects/la-central`,
      `${ORIGIN}/es/proyectos/obsidian-library`,
      `${ORIGIN}/en/projects/obsidian-library`,
      `${ORIGIN}/es/proyectos/selvatica`,
      `${ORIGIN}/en/projects/selvatica`,
      `${ORIGIN}/es/privacidad`,
      `${ORIGIN}/en/privacy`,
    ]);
  });

  it("never lists a ?lang= URL or the site root", () => {
    for (const entry of entries) {
      expect(entry.url).not.toContain("lang=");
      expect(entry.url).not.toBe(`${ORIGIN}/`);
    }
  });

  it("includes every entry inside its own hreflang set", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.values(languages)).toContain(entry.url);
      expect(Object.keys(languages).sort()).toEqual(["en", "es", "x-default"]);
      expect(languages["x-default"]).toBe(`${ORIGIN}/`);
    }
  });
});

describe("robots.txt", () => {
  it("references the www sitemap", () => {
    expect(robots().sitemap).toBe(`${ORIGIN}/sitemap.xml`);
  });
});

describe("legacy privacy metadata (?lang=)", () => {
  it.each([
    ["es", `${ORIGIN}/es/privacidad`],
    ["en", `${ORIGIN}/en/privacy`],
  ])("points the canonical at the new URL in %s", async (lang, url) => {
    language = lang;
    const meta = await privacy.generateMetadata();

    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.alternates?.languages).toEqual(languageAlternates({ page: "privacy" }));
    expect(meta.openGraph).toMatchObject({ url, description: meta.description });
    expect(String(meta.openGraph?.title)).toContain(String(meta.title));
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it.each([
    ["es", "Desarrollador Full Stack", "Developer"],
    ["en", "Full Stack Developer", "Desarrollador"],
  ])("describes the Open Graph image in %s only", async (lang, role, other) => {
    language = lang;
    const meta = await privacy.generateMetadata();
    const [image] = [meta.openGraph?.images].flat() as { alt: string }[];

    expect(image.alt).toBe(`Gerardo Martínez Monge - ${role}`);
    expect(image.alt).not.toContain(other);
  });
});

describe("legacy project metadata (?lang=)", () => {
  it.each([
    ["es", `${ORIGIN}/es/proyectos/la-central`],
    ["en", `${ORIGIN}/en/projects/la-central`],
  ])("points the canonical at the new URL in %s", async (lang, url) => {
    language = lang;
    const meta = await project.generateMetadata({
      params: Promise.resolve({ slug: "la-central" }),
    });
    const route = { page: "project", slug: "la-central" } as const;

    expect(localizedUrl(route, lang as "es" | "en")).toBe(url);
    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.alternates?.languages).toEqual(languageAlternates(route));
    expect(meta.openGraph?.url).toBe(url);
  });
});

describe("legacy not-found metadata", () => {
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
