import { describe, expect, it } from "vitest";
import {
  NAV_SECTIONS,
  SECTION_IDS,
  TOP_SECTION,
  getActiveSection,
  sectionPage,
} from "./sections";

describe("section list", () => {
  it("watches the top of the page and every navigation section, in order", () => {
    expect(SECTION_IDS).toEqual([
      "top",
      "proyectos",
      "experiencia",
      "sobre-mi",
      "stack",
      "servicios",
      "contacto",
    ]);
    expect(SECTION_IDS).toEqual([TOP_SECTION, ...NAV_SECTIONS.map((s) => s.id)]);
  });
});

describe("sectionPage", () => {
  it.each(["/es", "/en", "/"])("%s is the home page", (pathname) => {
    expect(sectionPage(pathname)).toBe("home");
  });

  it.each([
    "/es/proyectos/libra",
    "/en/projects/libra",
    "/es/proyectos/selvatica",
    "/proyectos/libra",
    "/proyectos/nope",
  ])("%s is a case study", (pathname) => {
    expect(sectionPage(pathname)).toBe("project");
  });

  it.each([
    "/es/privacidad",
    "/en/privacy",
    "/privacidad",
    "/es/nope",
    "/en/proyectos/libra",
    "/foo",
  ])("%s is neither", (pathname) => {
    expect(sectionPage(pathname)).toBeNull();
  });
});

describe("getActiveSection", () => {
  it.each(["/es", "/en", "/"])("%s follows the scroll position", (pathname) => {
    expect(getActiveSection(pathname, "top")).toBe("top");
    expect(getActiveSection(pathname, "experiencia")).toBe("experiencia");
    expect(getActiveSection(pathname, "contacto")).toBe("contacto");
  });

  it.each(["/es/proyectos/libra", "/en/projects/libra", "/proyectos/libra"])(
    "%s always marks the projects section",
    (pathname) => {
      expect(getActiveSection(pathname, "top")).toBe("proyectos");
      expect(getActiveSection(pathname, "contacto")).toBe("proyectos");
    },
  );

  it.each(["/es/privacidad", "/en/privacy", "/privacidad"])(
    "%s marks no section",
    (pathname) => {
      expect(getActiveSection(pathname, "proyectos")).toBeNull();
    },
  );
});
