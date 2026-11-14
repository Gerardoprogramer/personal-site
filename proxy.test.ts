import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
// The bundled docs call it unstable_doesProxyMatch, but Next.js 16.4.5 only
// exports the older name.
import { unstable_doesMiddlewareMatch as doesProxyMatch } from "next/experimental/testing/server";
import { config, proxy } from "./proxy";
import { PROJECT_SLUGS } from "@/lib/routes";

const BASE = "https://www.gerardomartinez.dev";

function request(path: string, headers: { cookie?: string; acceptLanguage?: string } = {}) {
  return new NextRequest(`${BASE}${path}`, {
    headers: {
      ...(headers.cookie ? { cookie: headers.cookie } : {}),
      ...(headers.acceptLanguage ? { "accept-language": headers.acceptLanguage } : {}),
    },
  });
}

// The language the proxy forwards to the legacy routes.
function forwardedLanguage(response: Response) {
  return response.headers.get("x-middleware-request-x-language");
}

function location(response: Response) {
  const value = response.headers.get("location");
  if (!value) return null;
  const url = new URL(value);
  expect(url.origin).toBe(BASE);
  return `${url.pathname}${url.search}`;
}

describe("proxy matcher", () => {
  it.each([
    "/",
    "/?lang=en",
    "/proyectos/libra",
    "/proyectos/libra?lang=en",
    "/proyectos/nope",
    "/privacidad",
    "/privacidad?lang=en",
  ])("runs on %s", (url) => {
    expect(doesProxyMatch({ config, url })).toBe(true);
  });

  it.each([
    "/es",
    "/en",
    "/es?lang=en",
    "/es/proyectos/libra",
    "/en/projects/libra",
    "/en/proyectos/libra",
    "/es/privacidad",
    "/en/privacy",
    "/foo",
    "/english",
    "/espanol",
    "/api/contact",
    "/_next/static/chunks/app.js",
    "/icon.svg",
    "/robots.txt",
    "/sitemap.xml",
  ])("skips %s", (url) => {
    expect(doesProxyMatch({ config, url })).toBe(false);
  });
});

describe("proxy: redirects of table 4.1", () => {
  const explicit: [string, string][] = [
    ["/?lang=es", "/es"],
    ["/?lang=en", "/en"],
    ["/privacidad?lang=es", "/es/privacidad"],
    ["/privacidad?lang=en", "/en/privacy"],
    ...PROJECT_SLUGS.flatMap((slug): [string, string][] => [
      [`/proyectos/${slug}?lang=es`, `/es/proyectos/${slug}`],
      [`/proyectos/${slug}?lang=en`, `/en/projects/${slug}`],
    ]),
  ];

  it.each(explicit)("%s -> 307 %s, private, stores the cookie", (from, to) => {
    const response = proxy(request(from));
    expect(response.status).toBe(307);
    expect(location(response)).toBe(to);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("vary")).toBeNull();
    expect(response.cookies.get("language")?.value).toBe(to.slice(1, 3));
  });

  it("does not rewrite a cookie that already matches ?lang=", () => {
    const response = proxy(request("/?lang=en", { cookie: "language=en" }));
    expect(location(response)).toBe("/en");
    expect(response.cookies.get("language")).toBeUndefined();
  });

  const negotiated: [string, string, string][] = [
    ["/", "/es", "/en"],
    ["/?lang=fr", "/es", "/en"],
    ["/privacidad", "/es/privacidad", "/en/privacy"],
    ["/proyectos/libra", "/es/proyectos/libra", "/en/projects/libra"],
  ];

  it.each(negotiated)("%s: 307 by cookie, then Accept-Language, then es", (from, es, en) => {
    const cases: [Parameters<typeof request>[1], string][] = [
      [{ cookie: "language=en", acceptLanguage: "es" }, en],
      [{ cookie: "language=es", acceptLanguage: "en" }, es],
      [{ acceptLanguage: "en-US,en;q=0.9" }, en],
      [{ cookie: "language=fr", acceptLanguage: "en" }, en],
      [{ acceptLanguage: "fr" }, es],
      [{}, es],
    ];
    for (const [headers, to] of cases) {
      const response = proxy(request(from, headers));
      expect(response.status).toBe(307);
      expect(location(response)).toBe(to);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(response.headers.get("vary")).toBe("Cookie, Accept-Language");
      expect(response.cookies.get("language")).toBeUndefined();
    }
  });

  it("keeps the other query parameters and drops lang", () => {
    const response = proxy(request("/proyectos/libra?utm_source=cv&lang=en&utm_medium=pdf"));
    expect(location(response)).toBe("/en/projects/libra?utm_source=cv&utm_medium=pdf");
  });

  it("never sends a 301 or 308", () => {
    for (const path of ["/", "/?lang=es", "/proyectos/libra", "/privacidad?lang=en"]) {
      expect(proxy(request(path)).status, path).toBe(307);
    }
  });
});

describe("proxy: unknown slugs keep their 404", () => {
  it("passes through with the language of ?lang= and stores it", () => {
    const response = proxy(request("/proyectos/nope?lang=en"));
    expect(response.headers.get("location")).toBeNull();
    expect(response.status).toBe(200);
    expect(forwardedLanguage(response)).toBe("en");
    expect(response.cookies.get("language")?.value).toBe("en");
  });

  it("falls back to the cookie, then Spanish", () => {
    expect(forwardedLanguage(proxy(request("/proyectos/nope", { cookie: "language=en" })))).toBe("en");
    const fallback = proxy(request("/proyectos/nope?lang=fr"));
    expect(forwardedLanguage(fallback)).toBe("es");
    expect(fallback.cookies.get("language")).toBeUndefined();
  });
});
