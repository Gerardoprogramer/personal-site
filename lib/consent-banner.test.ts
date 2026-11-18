import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONSENT_ANCHOR_SELECTOR,
  anchorPassed,
  shouldShowBanner,
} from "@/lib/consent-banner";

const entry = (isIntersecting: boolean, bottom: number) => ({
  isIntersecting,
  boundingClientRect: { bottom },
});

describe("anchorPassed", () => {
  it("is false while the anchor is on screen", () => {
    expect(anchorPassed(entry(true, 500))).toBe(false);
    // Partly scrolled out at the top but still visible.
    expect(anchorPassed(entry(true, 10))).toBe(false);
  });

  it("is false while the anchor is still below the viewport", () => {
    // 375x667: the availability line ends at y=800 on load.
    expect(anchorPassed(entry(false, 800))).toBe(false);
  });

  it("is true once the anchor has scrolled out of view above", () => {
    expect(anchorPassed(entry(false, 0))).toBe(true);
    expect(anchorPassed(entry(false, -120))).toBe(true);
  });
});

describe("shouldShowBanner", () => {
  it("never shows in the server render, where the choice is unknown", () => {
    expect(shouldShowBanner(undefined, true)).toBe(false);
  });

  it("never shows after a choice", () => {
    expect(shouldShowBanner("granted", true)).toBe(false);
    expect(shouldShowBanner("denied", true)).toBe(false);
  });

  it("waits for the anchor before asking", () => {
    expect(shouldShowBanner(null, false)).toBe(false);
    expect(shouldShowBanner(null, true)).toBe(true);
  });
});

describe("anchor in the hero", () => {
  it("marks exactly one element of the hero", () => {
    const hero = readFileSync(
      join(process.cwd(), "components/sections/Hero.tsx"),
      "utf8",
    );
    const attribute = CONSENT_ANCHOR_SELECTOR.slice(1, -1);
    expect(hero.split(attribute).length - 1).toBe(1);
  });
});
