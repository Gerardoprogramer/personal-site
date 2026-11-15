import { describe, expect, it } from "vitest";
import {
  CONSENT_KEY,
  GA_MEASUREMENT_ID,
  analyticsCommands,
  analyticsScriptSrc,
  parseConsent,
  shouldLoadAnalytics,
} from "./analytics";

describe("parseConsent", () => {
  it("reads the two stored choices", () => {
    expect(parseConsent("granted")).toBe("granted");
    expect(parseConsent("denied")).toBe("denied");
  });

  it.each([null, undefined, "", "true", "GRANTED", "yes"])(
    "treats %j as no choice",
    (stored) => {
      expect(parseConsent(stored)).toBeNull();
    },
  );

  it("is stored under the key the footer link clears", () => {
    expect(CONSENT_KEY).toBe("cookie-consent");
  });
});

describe("shouldLoadAnalytics", () => {
  it("loads gtag.js only after the visitor accepts", () => {
    expect(shouldLoadAnalytics("granted")).toBe(true);
  });

  it("loads nothing before a choice, on the server or after a rejection", () => {
    expect(shouldLoadAnalytics(null)).toBe(false);
    expect(shouldLoadAnalytics(undefined)).toBe(false);
    expect(shouldLoadAnalytics("denied")).toBe(false);
  });

  it("loads on start when the visitor accepted on an earlier visit", () => {
    expect(shouldLoadAnalytics(parseConsent("granted"))).toBe(true);
    expect(shouldLoadAnalytics(parseConsent("denied"))).toBe(false);
    expect(shouldLoadAnalytics(parseConsent(null))).toBe(false);
  });
});

describe("analyticsCommands", () => {
  const now = new Date("2026-11-15T12:00:00Z");
  const commands = analyticsCommands(now);

  it("starts with every consent type denied", () => {
    expect(commands[0]).toEqual([
      "consent",
      "default",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      },
    ]);
  });

  it("then grants analytics storage only, before configuring the property", () => {
    expect(commands.slice(1)).toEqual([
      ["consent", "update", { analytics_storage: "granted" }],
      ["js", now],
      ["config", GA_MEASUREMENT_ID],
    ]);
  });

  it("never grants an advertising consent type", () => {
    const granted = commands.flatMap(([, , options]) =>
      options && typeof options === "object"
        ? Object.entries(options).filter(([, value]) => value === "granted")
        : [],
    );
    expect(granted).toEqual([["analytics_storage", "granted"]]);
  });
});

describe("analyticsScriptSrc", () => {
  it("is the gtag.js URL of the site's property", () => {
    expect(analyticsScriptSrc()).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-EYVSL76CFW",
    );
  });
});
