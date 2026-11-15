import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";
import { projectsContent } from "@/lib/i18n/projects.content";

// Libra's figures are written by hand in three places: the hero line of the
// home page (es.json, en.json), the case study (projects.content.ts) and the
// "How I work with AI" section (AiPractice.tsx). They are dated and static;
// this only checks that they do not contradict each other.

const languages = ["es", "en"] as const;
const dictionaries = { es, en };

const numbersIn = (text: string) => (text.match(/\d+/g) ?? []).map(Number);

// The copy of AiPractice.tsx is not exported, so the test reads its source.
const aiPractice = readFileSync(
  join(process.cwd(), "components/projects/AiPractice.tsx"),
  "utf8",
);

function figures(lang: (typeof languages)[number]) {
  const libra = projectsContent[lang].libra;
  const [run, defined, commits] = libra.evidence.map((item) => item.value);
  const [conventional, total] = commits.split("/").map(Number);
  return {
    libra,
    run: Number(run),
    defined: Number(defined),
    conventional,
    total,
  };
}

describe.each(languages)("Libra figures (%s)", (lang) => {
  const { libra, run, defined, conventional, total } = figures(lang);

  it("reads three numeric figures from the case study", () => {
    for (const value of [run, defined, conventional, total]) {
      expect(Number.isInteger(value) && value > 0, String(value)).toBe(true);
    }
    expect(run).toBeLessThanOrEqual(defined);
    expect(conventional).toBeLessThanOrEqual(total);
  });

  it("the hero line states the same number of tests run in CI", () => {
    const proof = dictionaries[lang].hero.proof;
    expect(numbersIn(proof)).toContain(run);
    expect(numbersIn(proof)).not.toContain(defined);
  });

  it("the breakdown under the figures adds up", () => {
    const [tests, , history] = libra.evidenceList ?? [];
    // "CI runs 707 tests: 684 in the main job plus 23 integration tests, …
    // with 0 failures. The remaining 52 run only locally: 51 … and 1 …"
    const [inCi, mainJob, integration, failures, localOnly, epub, environment] =
      numbersIn(tests);
    expect(inCi).toBe(run);
    expect(mainJob + integration).toBe(run);
    expect(failures).toBe(0);
    expect(run + localOnly).toBe(defined);
    expect(epub + environment).toBe(localOnly);
    // "History: 132 of 137 non-merge commits follow the semantic convention."
    expect(numbersIn(history)).toEqual([conventional, total]);
  });
});

describe("Libra figures across languages and files", () => {
  it("are the same in Spanish and English", () => {
    const numbers = (lang: (typeof languages)[number]) => {
      const { run, defined, conventional, total } = figures(lang);
      return { run, defined, conventional, total };
    };
    expect(numbers("en")).toEqual(numbers("es"));
  });

  it("the AI section counts commits out of the same total", () => {
    const { total } = figures("es");
    // "al menos 45 de 137 commits" / "at least 45 of Libra’s 137 commits"
    const spanish = aiPractice.match(/al menos (\d+) de (\d+) commits/);
    const english = aiPractice.match(/at least (\d+) of Libra’s (\d+) commits/);
    expect(spanish, "Spanish sentence not found").not.toBeNull();
    expect(english, "English sentence not found").not.toBeNull();
    expect(Number(spanish![2])).toBe(total);
    expect(Number(english![2])).toBe(total);
    expect(spanish![1]).toBe(english![1]);
    expect(Number(spanish![1])).toBeLessThanOrEqual(total);
  });
});
