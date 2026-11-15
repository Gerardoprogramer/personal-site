import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cvFiles, cvHref } from "./portfolio";
import { projects } from "./projects";
import { defaultOgImage } from "@/lib/seo";

// Every file under public/ that the content or the components point to must
// exist, so a missing screenshot or CV fails here and not in production.

const root = process.cwd();
const publicPath = (url: string) =>
  join(root, "public", decodeURIComponent(url.split("?")[0]));

// Width and height from the IHDR chunk of a PNG file.
function pngSize(file: string) {
  const header = readFileSync(file).subarray(0, 24);
  expect(header.subarray(1, 4).toString("latin1"), file).toBe("PNG");
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

// "/projects/…" image paths written as string literals in a component.
function imagePathsIn(file: string) {
  const source = readFileSync(join(root, file), "utf8");
  return [...source.matchAll(/"(\/projects\/[^"]+\.(?:png|jpe?g|webp|avif|svg))"/g)].map(
    (match) => match[1],
  );
}

describe("project covers (content/projects.ts)", () => {
  const withCover = projects.filter((project) => project.cover);

  it("every project has a cover", () => {
    expect(withCover.map((p) => p.slug)).toEqual(projects.map((p) => p.slug));
  });

  it.each(withCover.map((p) => [p.slug, p.cover!] as const))(
    "%s: the file exists with the declared size",
    (_slug, cover) => {
      const file = publicPath(cover.src);
      expect(existsSync(file), cover.src).toBe(true);
      expect(pngSize(file)).toEqual({ width: cover.width, height: cover.height });
    },
  );
});

describe("images named in the case study components", () => {
  const components = [
    "components/projects/ProjectFeature.tsx",
    "components/projects/ProjectCaseStudy.tsx",
  ];

  it("finds the images these components use", () => {
    expect(components.flatMap(imagePathsIn).sort()).toEqual([
      "/projects/la-central-purchasing.png",
      "/projects/selvatica-experiences.png",
      "/projects/selvatica-mobile.png",
    ]);
  });

  it.each(components.flatMap(imagePathsIn))("%s exists", (src) => {
    expect(existsSync(publicPath(src)), src).toBe(true);
  });
});

describe("CV files (content/portfolio.ts)", () => {
  it.each(["es", "en"] as const)("the %s CV exists under its real name", (lang) => {
    expect(existsSync(join(root, "public", "CV", cvFiles[lang])), cvFiles[lang]).toBe(true);
  });

  it.each(["es", "en"] as const)("the %s link decodes to that file", (lang) => {
    const href = cvHref(lang);
    expect(href).not.toContain(" ");
    expect(decodeURIComponent(href)).toBe(`/CV/${cvFiles[lang]}`);
    expect(existsSync(publicPath(href)), href).toBe(true);
  });
});

describe("default Open Graph images (lib/seo.ts)", () => {
  it.each(["es", "en"] as const)("the %s image exists and is 1200 by 630", (lang) => {
    const file = publicPath(defaultOgImage(lang));
    expect(existsSync(file), defaultOgImage(lang)).toBe(true);
    expect(pngSize(file)).toEqual({ width: 1200, height: 630 });
  });
});
