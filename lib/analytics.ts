// Google Analytics loads only after the visitor accepts it in the cookie
// banner. Everything here is pure, so the decision and the gtag commands can
// be tested without a browser; components/layout/CookieConsent.tsx runs them.

export const GA_MEASUREMENT_ID = "G-EYVSL76CFW";

// localStorage key of the visitor's choice. Not a cookie.
export const CONSENT_KEY = "cookie-consent";

export type ConsentValue = "granted" | "denied";

// The stored choice, or null when there is none or the value is not ours.
export function parseConsent(
  stored: string | null | undefined,
): ConsentValue | null {
  return stored === "granted" || stored === "denied" ? stored : null;
}

// gtag.js is requested only with an explicit "granted": not before the visitor
// chooses, and never after a "denied".
export function shouldLoadAnalytics(
  consent: ConsentValue | null | undefined,
): boolean {
  return consent === "granted";
}

export function analyticsScriptSrc(id: string = GA_MEASUREMENT_ID) {
  return `https://www.googletagmanager.com/gtag/js?id=${id}`;
}

export type GtagCommand = [command: string, ...args: unknown[]];

// The gtag calls queued, in this order, right before gtag.js is added to the
// page: consent starts as denied, then analytics_storage alone is granted.
export function analyticsCommands(
  now: Date,
  id: string = GA_MEASUREMENT_ID,
): GtagCommand[] {
  return [
    [
      "consent",
      "default",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      },
    ],
    ["consent", "update", { analytics_storage: "granted" }],
    ["js", now],
    ["config", id],
  ];
}
