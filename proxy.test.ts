import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
// The bundled docs call it unstable_doesProxyMatch, but Next.js 16.4.5 only
// exports the older name.
import { unstable_doesMiddlewareMatch as doesProxyMatch } from "next/experimental/testing/server";
import { config, proxy } from "./proxy";

const BASE = "https://www.gerardomartinez.dev";

function request(path: string, cookie?: string) {
  return new NextRequest(`${BASE}${path}`, {
    headers: cookie ? { cookie } : {},
  });
}

// The language the proxy forwards to the legacy routes.
function forwardedLanguage(response: Response) {
  return response.headers.get("x-middleware-request-x-language");
}

describe("proxy matcher", () => {
  it.each([
    "/",
    "/?lang=en",
    "/proyectos/libra",
    "/proyectos/libra?lang=en",
    "/privacidad",
    "/foo",
    "/english",
    "/espanol",
  ])("runs on %s", (url) => {
    expect(doesProxyMatch({ config, url })).toBe(true);
  });

  it.each([
    "/es",
    "/en",
    "/es?lang=en",
    "/es/proyectos/libra",
    "/en/projects/libra",
    "/es/privacidad",
    "/en/privacy",
    "/api/contact",
    "/_next/static/chunks/app.js",
    "/icon.svg",
    "/robots.txt",
    "/sitemap.xml",
  ])("skips %s", (url) => {
    expect(doesProxyMatch({ config, url })).toBe(false);
  });
});

describe("proxy on legacy URLs", () => {
  it("uses ?lang= and stores it in the cookie", () => {
    const response = proxy(request("/proyectos/libra?lang=en"));
    expect(response.status).toBe(200);
    expect(forwardedLanguage(response)).toBe("en");
    expect(response.cookies.get("language")?.value).toBe("en");
    expect(response.headers.get("location")).toBeNull();
  });

  it("falls back to the cookie, then Spanish, without setting a cookie", () => {
    const fromCookie = proxy(request("/", "language=en"));
    expect(forwardedLanguage(fromCookie)).toBe("en");
    expect(fromCookie.cookies.get("language")).toBeUndefined();

    const fallback = proxy(request("/"));
    expect(forwardedLanguage(fallback)).toBe("es");
    expect(fallback.cookies.get("language")).toBeUndefined();
  });

  it("ignores an unsupported ?lang=", () => {
    const response = proxy(request("/?lang=fr"));
    expect(forwardedLanguage(response)).toBe("es");
    expect(response.cookies.get("language")).toBeUndefined();
  });

  it("does not rewrite the cookie when ?lang= already matches it", () => {
    const response = proxy(request("/?lang=en", "language=en"));
    expect(forwardedLanguage(response)).toBe("en");
    expect(response.cookies.get("language")).toBeUndefined();
  });

  it("never redirects in stage 1", () => {
    for (const path of ["/", "/?lang=es", "/proyectos/libra", "/privacidad?lang=en"]) {
      const response = proxy(request(path));
      expect(response.status, path).toBe(200);
      expect(response.headers.get("location"), path).toBeNull();
    }
  });
});
