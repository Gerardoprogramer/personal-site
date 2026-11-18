// When the cookie banner may appear. Pure, so it can be tested without a
// browser; components/layout/CookieConsent.tsx runs it.
//
// The banner is fixed to the bottom of the viewport. On the home page it would
// cover the hero's actions and availability on a first visit, so it waits
// until they have scrolled out of view above. Google Analytics waits for the
// visitor's choice either way (lib/analytics.ts).

import type { ConsentValue } from "@/lib/analytics";

// The element the banner waits for: the last of the hero's actions and its
// availability line (components/sections/Hero.tsx). Pages without it show the
// banner at once.
export const CONSENT_ANCHOR_SELECTOR = "[data-consent-anchor]";

// The part of an IntersectionObserverEntry that matters here.
export interface AnchorEntry {
  isIntersecting: boolean;
  boundingClientRect: { bottom: number };
}

// True once the anchor is out of view above the viewport. An anchor below the
// viewport (a short screen) has not been passed yet.
export function anchorPassed(entry: AnchorEntry): boolean {
  return !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
}

// The banner shows only to a visitor who has not chosen yet (null; undefined
// is the server render, where storage cannot be read) and only once the anchor
// has been passed or the page has none.
export function shouldShowBanner(
  consent: ConsentValue | null | undefined,
  passed: boolean,
): boolean {
  return consent === null && passed;
}
