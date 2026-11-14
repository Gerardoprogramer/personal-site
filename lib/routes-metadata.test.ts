import { describe, expect, it, vi } from "vitest";
import type { Metadata } from "next";

// The layout renders the shared shell (next/font, Google Analytics); only its
// metadata is under test here.
vi.mock("@/components/layout/SiteShell", () => ({ SiteShell: () => null }));

const layout = await import("@/app/[lang]/layout");
const esProject = await import("@/app/[lang]/proyectos/[slug]/page");
const enProject = await import("@/app/[lang]/projects/[slug]/page");
const esPrivacy = await import("@/app/[lang]/privacidad/page");
const enPrivacy = await import("@/app/[lang]/privacy/page");

const ORIGIN = "https://www.gerardomartinez.dev";

const params = <T,>(value: T) => ({ params: Promise.resolve(value) });

function expectPageMetadata(
  meta: Metadata,
  { url, es, en, locale, alternate }: Record<string, string>,
) {
  expect(meta.alternates?.canonical).toBe(url);
  expect(meta.alternates?.languages).toEqual({ es, en, "x-default": `${ORIGIN}/` });
  expect(meta.openGraph).toMatchObject({ url, locale, alternateLocale: alternate });
}

describe("/es and /en static params", () => {
  it("prerenders exactly the pages of each language", () => {
    expect(layout.generateStaticParams()).toEqual([{ lang: "es" }, { lang: "en" }]);
    expect(layout.dynamicParams).toBe(false);
    expect(esProject.generateStaticParams().map((p) => `${p.lang}/${p.slug}`)).toEqual([
      "es/libra",
      "es/la-central",
      "es/obsidian-library",
      "es/selvatica",
    ]);
    expect(enProject.generateStaticParams().every((p) => p.lang === "en")).toBe(true);
    expect(esPrivacy.generateStaticParams()).toEqual([{ lang: "es" }]);
    expect(enPrivacy.generateStaticParams()).toEqual([{ lang: "en" }]);
    for (const page of [esProject, enProject, esPrivacy, enPrivacy]) {
      expect(page.dynamicParams).toBe(false);
    }
  });
});

describe("home metadata", () => {
  it.each([
    ["es", "es_CR", "en_US"],
    ["en", "en_US", "es_CR"],
  ])("/%s has its own canonical, hreflang and og:locale", async (lang, locale, alternate) => {
    const meta = await layout.generateMetadata(params({ lang }));
    expectPageMetadata(meta, {
      url: `${ORIGIN}/${lang}`,
      es: `${ORIGIN}/es`,
      en: `${ORIGIN}/en`,
      locale,
      alternate,
    });
  });
});

describe("case study metadata", () => {
  it("/es/proyectos/libra", async () => {
    const meta = await esProject.generateMetadata(params({ lang: "es", slug: "libra" }));
    expectPageMetadata(meta, {
      url: `${ORIGIN}/es/proyectos/libra`,
      es: `${ORIGIN}/es/proyectos/libra`,
      en: `${ORIGIN}/en/projects/libra`,
      locale: "es_CR",
      alternate: "en_US",
    });
  });

  it("/en/projects/libra", async () => {
    const meta = await enProject.generateMetadata(params({ lang: "en", slug: "libra" }));
    expectPageMetadata(meta, {
      url: `${ORIGIN}/en/projects/libra`,
      es: `${ORIGIN}/es/proyectos/libra`,
      en: `${ORIGIN}/en/projects/libra`,
      locale: "en_US",
      alternate: "es_CR",
    });
  });

  it("is a 404 in the other language's folder or for an unknown slug", async () => {
    await expect(
      esProject.generateMetadata(params({ lang: "en", slug: "libra" })),
    ).rejects.toThrow();
    await expect(
      enProject.generateMetadata(params({ lang: "en", slug: "nope" })),
    ).rejects.toThrow();
  });
});

describe("privacy metadata", () => {
  it.each([
    [esPrivacy, "es", `${ORIGIN}/es/privacidad`, "es_CR", "en_US"],
    [enPrivacy, "en", `${ORIGIN}/en/privacy`, "en_US", "es_CR"],
  ] as const)("%#: /%s", async (page, lang, url, locale, alternate) => {
    const meta = await page.generateMetadata(params({ lang }));
    expectPageMetadata(meta, {
      url,
      es: `${ORIGIN}/es/privacidad`,
      en: `${ORIGIN}/en/privacy`,
      locale,
      alternate,
    });
  });
});
