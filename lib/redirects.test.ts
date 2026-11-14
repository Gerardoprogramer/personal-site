import { describe, expect, it } from "vitest";
import {
  crossLanguageRedirects,
  languageFromAcceptLanguage,
  legacyRedirect,
  negotiateLanguage,
} from "./redirects";
import { PROJECT_SLUGS, parsePath } from "./routes";
import nextConfig from "../next.config";

function redirectOf(url: string, cookie?: string, acceptLanguage?: string) {
  const { pathname, search } = new URL(url, "https://www.gerardomartinez.dev");
  return legacyRedirect({ pathname, search, cookie, acceptLanguage });
}

describe("languageFromAcceptLanguage", () => {
  it.each([
    ["en-US,en;q=0.9", "en"],
    ["es-CR,es;q=0.9,en;q=0.8", "es"],
    ["fr-FR,fr;q=0.9,en;q=0.8,es;q=0.7", "en"],
    ["es;q=0.5,en;q=0.6", "en"],
    ["EN-gb", "en"],
    ["en;q=0,es;q=0.1", "es"],
    ["en;q=0.8,es;q=0.8", "en"],
    ["en;q=abc,es;q=0.1", "es"],
  ])("%s -> %s", (header, expected) => {
    expect(languageFromAcceptLanguage(header)).toBe(expected);
  });

  it.each([undefined, null, "", "fr", "*", "de-DE,fr;q=0.5", "en;q=0"])(
    "%s -> null",
    (header) => {
      expect(languageFromAcceptLanguage(header)).toBeNull();
    },
  );
});

describe("negotiateLanguage", () => {
  it("prefers a valid cookie over Accept-Language", () => {
    expect(negotiateLanguage("en", "es")).toBe("en");
    expect(negotiateLanguage("es", "en")).toBe("es");
  });

  it("ignores an invalid cookie", () => {
    expect(negotiateLanguage("fr", "en")).toBe("en");
    expect(negotiateLanguage("", "en")).toBe("en");
  });

  it("falls back to Spanish", () => {
    expect(negotiateLanguage(undefined, undefined)).toBe("es");
    expect(negotiateLanguage("fr", "fr-FR")).toBe("es");
  });
});

describe("legacyRedirect: table 4.1 with ?lang=", () => {
  const rows: [string, string][] = [
    ["/?lang=es", "/es"],
    ["/?lang=en", "/en"],
    ["/privacidad?lang=es", "/es/privacidad"],
    ["/privacidad?lang=en", "/en/privacy"],
    ...PROJECT_SLUGS.flatMap((slug): [string, string][] => [
      [`/proyectos/${slug}?lang=es`, `/es/proyectos/${slug}`],
      [`/proyectos/${slug}?lang=en`, `/en/projects/${slug}`],
    ]),
  ];

  it.each(rows)("%s -> %s", (from, to) => {
    // The explicit ?lang= wins over the cookie and Accept-Language.
    const other = to.startsWith("/es") ? "en" : "es";
    expect(redirectOf(from, other, other)).toEqual({
      location: to,
      lang: to.slice(1, 3),
      negotiated: false,
    });
  });
});

describe("legacyRedirect: without ?lang=", () => {
  const paths: [string, string, string][] = [
    ["/", "/es", "/en"],
    ["/privacidad", "/es/privacidad", "/en/privacy"],
    ...PROJECT_SLUGS.map((slug): [string, string, string] => [
      `/proyectos/${slug}`,
      `/es/proyectos/${slug}`,
      `/en/projects/${slug}`,
    ]),
  ];

  it.each(paths)("%s: cookie, then Accept-Language, then es", (from, es, en) => {
    expect(redirectOf(from, "en", "es")).toMatchObject({ location: en, negotiated: true });
    expect(redirectOf(from, "es", "en")).toMatchObject({ location: es, negotiated: true });
    expect(redirectOf(from, undefined, "en-US,en;q=0.9")).toMatchObject({ location: en });
    expect(redirectOf(from, "fr", "en")).toMatchObject({ location: en });
    expect(redirectOf(from, undefined, "fr")).toMatchObject({ location: es });
    expect(redirectOf(from)).toMatchObject({ location: es, negotiated: true });
  });

  it.each(["/?lang=fr", "/?lang=", "/?lang=EN", "/privacidad?lang=de"])(
    "%s: an invalid ?lang= counts as missing",
    (from) => {
      const result = redirectOf(from, "en");
      expect(result?.negotiated).toBe(true);
      expect(result?.lang).toBe("en");
      expect(result?.location).not.toContain("lang=");
    },
  );
});

describe("legacyRedirect: query", () => {
  it("keeps the other parameters and drops lang", () => {
    expect(redirectOf("/?utm_source=linkedin&lang=en&utm_medium=social")?.location).toBe(
      "/en?utm_source=linkedin&utm_medium=social",
    );
    expect(redirectOf("/proyectos/libra?lang=es&ref=cv")?.location).toBe(
      "/es/proyectos/libra?ref=cv",
    );
    expect(redirectOf("/privacidad?utm_campaign=x", "en")?.location).toBe(
      "/en/privacy?utm_campaign=x",
    );
  });

  it("drops a repeated lang", () => {
    expect(redirectOf("/?lang=en&lang=es")?.location).toBe("/en");
  });
});

describe("legacyRedirect: no redirect", () => {
  it.each([
    "/proyectos/nope",
    "/proyectos/nope?lang=en",
    "/proyectos/LIBRA",
    "/proyectos/libra/extra",
    "/proyectos",
    "/proyectos/",
    "/privacidad/extra",
    "/es",
    "/en/projects/libra",
    "/foo",
  ])("%s", (path) => {
    expect(redirectOf(path, "en", "en")).toBeNull();
  });
});

describe("legacyRedirect: one hop, no loops", () => {
  const sources = [
    "/",
    "/?lang=es",
    "/?lang=en",
    "/?lang=fr",
    "/privacidad",
    "/privacidad?lang=en",
    ...PROJECT_SLUGS.flatMap((slug) => [
      `/proyectos/${slug}`,
      `/proyectos/${slug}?lang=es`,
      `/proyectos/${slug}?lang=en`,
    ]),
  ];

  it.each(sources)("%s lands on a page that does not redirect again", (from) => {
    for (const cookie of [undefined, "es", "en"]) {
      const location = redirectOf(`${from}${from.includes("?") ? "&" : "?"}utm_source=x`, cookie)!.location;
      expect(location).not.toContain("lang=");
      const { pathname } = new URL(location, "https://www.gerardomartinez.dev");
      // The destination is a page of the new routes...
      expect(parsePath(pathname)).not.toBeNull();
      // ...that the proxy logic does not redirect...
      expect(redirectOf(location, cookie)).toBeNull();
      // ...and that no next.config rule matches.
      for (const rule of crossLanguageRedirects()) {
        expect(matches(rule.source, pathname)).toBe(false);
      }
    }
  });
});

// Enough of path-to-regexp for the rules in crossLanguageRedirects().
function matches(source: string, pathname: string) {
  const pattern = source.replace(/:(\w+)\(([^)]+)\)/g, "($2)");
  return new RegExp(`^${pattern}$`).test(pathname);
}

describe("crossLanguageRedirects", () => {
  const rows: [string, string][] = [
    ["/en/privacidad", "/en/privacy"],
    ["/es/privacy", "/es/privacidad"],
    ...PROJECT_SLUGS.flatMap((slug): [string, string][] => [
      [`/en/proyectos/${slug}`, `/en/projects/${slug}`],
      [`/es/projects/${slug}`, `/es/proyectos/${slug}`],
    ]),
  ];

  it.each(rows)("%s -> %s", (from, to) => {
    const hits = crossLanguageRedirects().filter((rule) => matches(rule.source, from));
    expect(hits).toHaveLength(1);
    const [rule] = hits;
    const slug = from.split("/")[3];
    expect(rule.destination.replace(":slug", slug)).toBe(to);
    // The destination is a real page, and no rule matches it.
    expect(parsePath(to)).not.toBeNull();
    expect(crossLanguageRedirects().some((r) => matches(r.source, to))).toBe(false);
  });

  it("is temporary (307), never 301 or 308", () => {
    for (const rule of crossLanguageRedirects()) {
      expect(rule.permanent).toBe(false);
      expect(rule).not.toHaveProperty("statusCode");
    }
  });

  it.each(["/en/proyectos/nope", "/es/projects/nope", "/en/proyectos/libra/x", "/fr/privacy"])(
    "does not redirect %s",
    (path) => {
      expect(crossLanguageRedirects().some((r) => matches(r.source, path))).toBe(false);
    },
  );

  it("is wired into next.config", async () => {
    expect(await nextConfig.redirects?.()).toEqual(crossLanguageRedirects());
  });
});
