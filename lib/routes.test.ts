import { describe, expect, it } from "vitest";
import {
  LANGUAGES,
  PROJECT_SLUGS,
  allRoutes,
  legacyPathFor,
  parsePath,
  pathFor,
} from "./routes";

describe("pathFor", () => {
  it("builds every page in both languages", () => {
    expect(LANGUAGES.flatMap((lang) => allRoutes().map((r) => pathFor(r, lang))))
      .toEqual([
        "/es",
        "/es/proyectos/libra",
        "/es/proyectos/la-central",
        "/es/proyectos/obsidian-library",
        "/es/proyectos/selvatica",
        "/es/privacidad",
        "/en",
        "/en/projects/libra",
        "/en/projects/la-central",
        "/en/projects/obsidian-library",
        "/en/projects/selvatica",
        "/en/privacy",
      ]);
  });

  it("never adds a lang query or a trailing slash", () => {
    for (const lang of LANGUAGES) {
      for (const route of allRoutes()) {
        const path = pathFor(route, lang);
        expect(path).not.toContain("lang=");
        expect(path.endsWith("/")).toBe(false);
      }
    }
  });
});

describe("parsePath", () => {
  it("is the inverse of pathFor", () => {
    for (const lang of LANGUAGES) {
      for (const route of allRoutes()) {
        expect(parsePath(pathFor(route, lang))).toEqual({ lang, route });
      }
    }
  });

  it("rejects paths that are not pages of the site", () => {
    for (const path of [
      "/",
      "/fr",
      "/es/nope",
      "/en/projects/nope",
      "/en/proyectos/libra",
      "/es/projects/libra",
      "/en/privacidad",
      "/es/privacy",
      "/es/proyectos",
      "/es/proyectos/libra/extra",
      "/proyectos/libra",
    ]) {
      expect(parsePath(path), path).toBeNull();
    }
  });
});

describe("project slug mapping", () => {
  it("keeps the same slug in both languages and only translates the segment", () => {
    for (const slug of PROJECT_SLUGS) {
      const es = pathFor({ page: "project", slug }, "es");
      const en = pathFor({ page: "project", slug }, "en");
      expect(es).toBe(`/es/proyectos/${slug}`);
      expect(en).toBe(`/en/projects/${slug}`);
      expect(parsePath(es)?.route).toEqual(parsePath(en)?.route);
    }
  });

  it("covers the four projects", () => {
    expect([...PROJECT_SLUGS].sort()).toEqual([
      "la-central",
      "libra",
      "obsidian-library",
      "selvatica",
    ]);
  });
});

describe("legacyPathFor", () => {
  it("matches the ?lang= URLs the legacy routes link to today", () => {
    expect(legacyPathFor({ page: "home" }, "en")).toBe("/?lang=en");
    expect(legacyPathFor({ page: "project", slug: "libra" }, "es")).toBe(
      "/proyectos/libra?lang=es",
    );
    expect(legacyPathFor({ page: "privacy" }, "en")).toBe("/privacidad?lang=en");
  });
});
