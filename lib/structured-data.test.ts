import { describe, expect, it } from "vitest";
import { socials } from "@/content/portfolio";
import { CORE_STACK } from "@/content/stack";
import { projectDemo, projects } from "@/content/projects";
import { projectsContent } from "@/lib/i18n/projects.content";
import {
  PERSON_ID,
  personJsonLd,
  projectJsonLd,
  serializeJsonLd,
} from "./structured-data";

// Fails on "", [], {}, null or undefined anywhere in the tree.
function expectNoEmptyValues(value: unknown, path = "$"): void {
  expect(value, path).not.toBeNull();
  expect(value, path).not.toBeUndefined();
  if (typeof value === "string") expect(value.trim(), path).not.toBe("");
  if (Array.isArray(value)) {
    expect(value.length, path).toBeGreaterThan(0);
    value.forEach((item, i) => expectNoEmptyValues(item, `${path}[${i}]`));
  } else if (value && typeof value === "object") {
    const entries = Object.entries(value);
    expect(entries.length, path).toBeGreaterThan(0);
    for (const [key, item] of entries) expectNoEmptyValues(item, `${path}.${key}`);
  }
}

describe("Person JSON-LD", () => {
  it.each([
    ["es", "Desarrollador Full Stack"],
    ["en", "Full Stack Developer"],
  ] as const)("uses a single-language job title in %s", (lang, title) => {
    expect(personJsonLd(lang).jobTitle).toBe(title);
  });

  it("lists the core stack shown on the page", () => {
    expect(personJsonLd("es").knowsAbout).toEqual(CORE_STACK);
  });

  it("links only the profiles shown in the header", () => {
    expect(personJsonLd("en").sameAs).toEqual([socials.github, socials.linkedin]);
  });

  it.each(["es", "en"] as const)("is valid JSON without empty values in %s", (lang) => {
    const parsed = JSON.parse(serializeJsonLd(personJsonLd(lang)));
    expectNoEmptyValues(parsed);
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the script tag", () => {
    const json = serializeJsonLd({ name: "</script>" });
    expect(json).not.toContain("<");
    expect(JSON.parse(json).name).toBe("</script>");
  });
});

describe("project JSON-LD", () => {
  const cases = projects.flatMap((project) =>
    (["es", "en"] as const).map((lang) => [project.slug, lang, project] as const),
  );

  it.each(cases)("%s (%s) matches the visible case study", (_slug, lang, project) => {
    const data = JSON.parse(serializeJsonLd(projectJsonLd(project, lang)));
    expectNoEmptyValues(data);
    expect(data.name).toBe(project.name);
    expect(data.description).toBe(projectsContent[lang][project.slug].introduction);
    expect(data.author["@id"]).toBe(PERSON_ID);
    expect(data.author["@id"]).toBe(personJsonLd(lang)["@id"]);
    expect(data.url).toBe(projectDemo(project, lang));
    expect(data.isBasedOn?.map((r: { codeRepository: string }) => r.codeRepository)).toEqual(
      project.repositories.length ? project.repositories.map((r) => r.href) : undefined,
    );
  });

  it("describes Selvática as a website, not an application", () => {
    const selvatica = projects.find((p) => p.slug === "selvatica")!;
    const data = projectJsonLd(selvatica, "es");
    expect(data["@type"]).toBe("CreativeWork");
    expect(data).not.toHaveProperty("applicationCategory");
  });

  it("states languages only for Libra, whose page names them", () => {
    for (const project of projects) {
      const data = projectJsonLd(project, "en");
      if (project.slug === "libra") expect(data).toHaveProperty("inLanguage", ["es", "en"]);
      else expect(data).not.toHaveProperty("inLanguage");
    }
  });
});
