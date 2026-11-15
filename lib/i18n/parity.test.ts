import { describe, expect, it } from "vitest";
import es from "./es.json";
import en from "./en.json";
import { caseLabels, projectsContent } from "./projects.content";

// Spanish and English must have the same shape: the same keys, including the
// optional ones, lists of the same length, no empty text and no text left
// untranslated. TypeScript only checks the required keys.

// Text that is rightly the same in both languages: proper names, brands,
// technologies and abbreviations. Add to this list on purpose, never to make
// a failing test pass.
const SAME_IN_BOTH_LANGUAGES = new Set([
  "Gerardo Martínez Monge",
  "Next.js",
  "TypeScript",
  "Java",
  "Spring Boot",
  "NestJS",
  "PostgreSQL",
  "ERP",
  "Stack",
  "CI",
  "LAN",
  "48 h",
]);

type Leaves = Map<string, string>;

// Every leaf of a tree as "path -> kind". Lists also record their length, so
// two lists of different sizes differ even before their items are compared.
function shapeOf(value: unknown, path = "$", out: Leaves = new Map()): Leaves {
  if (Array.isArray(value)) {
    out.set(path, `list of ${value.length}`);
    value.forEach((item, index) => shapeOf(item, `${path}[${index}]`, out));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      shapeOf(item, `${path}.${key}`, out);
    }
  } else {
    out.set(path, typeof value);
  }
  return out;
}

// Human-readable differences between the shapes of the two languages.
function shapeDifferences(spanish: unknown, english: unknown): string[] {
  const a = shapeOf(spanish);
  const b = shapeOf(english);
  const differences: string[] = [];
  for (const [path, kind] of a) {
    if (!b.has(path)) differences.push(`${path}: only in Spanish`);
    else if (b.get(path) !== kind) {
      differences.push(`${path}: ${kind} in Spanish, ${b.get(path)} in English`);
    }
  }
  for (const path of b.keys()) {
    if (!a.has(path)) differences.push(`${path}: only in English`);
  }
  return differences;
}

function stringsOf(
  value: unknown,
  path = "$",
  out: Map<string, string> = new Map(),
): Map<string, string> {
  if (typeof value === "string") out.set(path, value);
  else if (Array.isArray(value)) {
    value.forEach((item, index) => stringsOf(item, `${path}[${index}]`, out));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      stringsOf(item, `${path}.${key}`, out);
    }
  }
  return out;
}

function emptyStrings(value: unknown): string[] {
  return [...stringsOf(value)]
    .filter(([, text]) => text.trim() === "")
    .map(([path]) => path);
}

// Figures ("707", "132/137") and URLs carry no language.
function isLanguageNeutral(text: string) {
  return !/\p{L}/u.test(text) || /^https?:\/\//.test(text);
}

// Paths whose text is identical in both languages and is not an exception.
function untranslated(spanish: unknown, english: unknown): string[] {
  const other = stringsOf(english);
  return [...stringsOf(spanish)]
    .filter(
      ([path, text]) =>
        other.get(path) === text &&
        !isLanguageNeutral(text) &&
        !SAME_IN_BOTH_LANGUAGES.has(text),
    )
    .map(([path, text]) => `${path}: "${text}"`);
}

const sources = [
  ["es.json and en.json", es, en],
  ["projectsContent", projectsContent.es, projectsContent.en],
  ["caseLabels", caseLabels.es, caseLabels.en],
] as const;

describe.each(sources)("%s", (_name, spanish, english) => {
  it("has the same keys, optional fields and list lengths in both languages", () => {
    expect(shapeDifferences(spanish, english)).toEqual([]);
  });

  it("has no empty text", () => {
    expect(emptyStrings(spanish)).toEqual([]);
    expect(emptyStrings(english)).toEqual([]);
  });

  it("has no text left untranslated", () => {
    expect(untranslated(spanish, english)).toEqual([]);
  });
});

// The checks above are only worth something if they fail when the content
// breaks. Each case below breaks a copy of the real content in one way.
describe("the parity checks catch real breakage", () => {
  const copy = <T,>(value: T): T => structuredClone(value);

  it("a key missing in English", () => {
    const broken = copy(en) as Record<string, Record<string, unknown>>;
    delete broken.hero.proof;
    expect(shapeDifferences(es, broken)).toEqual(["$.hero.proof: only in Spanish"]);
  });

  it("a key that exists only in English", () => {
    const broken = copy(en) as Record<string, Record<string, unknown>>;
    broken.hero.extra = "Only here";
    expect(shapeDifferences(es, broken)).toEqual(["$.hero.extra: only in English"]);
  });

  it("an optional field written in one language only", () => {
    const broken = copy(projectsContent.en);
    delete broken.selvatica.closing;
    expect(shapeDifferences(projectsContent.es, broken)).toEqual([
      "$.selvatica.closing: only in Spanish",
    ]);
  });

  it("a list that is shorter in one language", () => {
    const broken = copy(projectsContent.en);
    const expected = projectsContent.es.libra.decisions.length;
    broken.libra.decisions.pop();
    expect(shapeDifferences(projectsContent.es, broken)).toContain(
      `$.libra.decisions: list of ${expected} in Spanish, list of ${expected - 1} in English`,
    );
  });

  it("an empty text", () => {
    const broken = copy(caseLabels.en);
    broken.back = "  ";
    expect(emptyStrings(broken)).toEqual(["$.back"]);
  });

  it("a text copied from Spanish without translating it", () => {
    const broken = copy(en);
    broken.meta.keywords[9] = es.meta.keywords[9];
    expect(untranslated(es, broken)).toEqual([
      `$.meta.keywords[9]: "${es.meta.keywords[9]}"`,
    ]);
  });
});
