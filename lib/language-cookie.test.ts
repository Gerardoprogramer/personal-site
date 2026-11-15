import { describe, expect, it } from "vitest";
import {
  LANGUAGE_COOKIE_MAX_AGE,
  languageCookieAttributes,
  languageCookieString,
} from "./language-cookie";

describe("languageCookieAttributes", () => {
  it("lasts one year on the whole site with SameSite=Lax", () => {
    expect(LANGUAGE_COOKIE_MAX_AGE).toBe(365 * 24 * 60 * 60);
    expect(languageCookieAttributes("https:")).toEqual({
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      secure: true,
    });
  });

  it("sets Secure only over HTTPS", () => {
    expect(languageCookieAttributes("https:").secure).toBe(true);
    expect(languageCookieAttributes("http:").secure).toBe(false);
  });
});

describe("languageCookieString", () => {
  it("writes the same attributes for document.cookie", () => {
    expect(languageCookieString("en", "https:")).toBe(
      "language=en; path=/; max-age=31536000; SameSite=Lax; Secure",
    );
    expect(languageCookieString("es", "http:")).toBe(
      "language=es; path=/; max-age=31536000; SameSite=Lax",
    );
  });
});
