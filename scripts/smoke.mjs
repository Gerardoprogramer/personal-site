// Smoke test against the production build: starts `next start`, requests the
// legacy and the /es and /en URLs, and fails on any unexpected status, missing
// noindex on a 404, redirect on a new page, wrong canonical, Set-Cookie on a
// prerendered page, link from the new routes into the legacy ones, or legacy
// redirect that is not a single 307 to the expected page. It also checks that
// sitemap.xml lists exactly the pages it visited.
//
// Usage: pnpm build && node scripts/smoke.mjs
// If port 3100 is taken: SMOKE_PORT=3187 node scripts/smoke.mjs
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const PORT = process.env.SMOKE_PORT ?? "3100";
const BASE = `http://localhost:${PORT}`;
const ORIGIN = "https://www.gerardomartinez.dev";

// The project slugs, read from content/projects.ts so a new project is covered
// without editing this file. Read as text: Node cannot import the TypeScript
// file with its "@/" alias.
const SLUGS = [
  ...readFileSync(new URL("../content/projects.ts", import.meta.url), "utf8")
    .matchAll(/^\s+slug: "([^"]+)",/gm),
].map((match) => match[1]);
if (SLUGS.length === 0) {
  throw new Error("No project slugs found in content/projects.ts");
}

// Every page of the site, path -> canonical URL: the home page, each case
// study and the privacy policy, in both languages.
const NEW_PAGES = Object.fromEntries(
  [
    "/es",
    "/en",
    ...SLUGS.flatMap((slug) => [`/es/proyectos/${slug}`, `/en/projects/${slug}`]),
    "/es/privacidad",
    "/en/privacy",
  ].map((path) => [path, `${ORIGIN}${path}`]),
);

// Stage 2 redirects (table 4.1): every row must answer 307 with this Location,
// and the destination must answer 200 without redirecting again.
// [path, request headers, expected Location, depends on the visitor]
const REDIRECTS = [
  ["/?lang=es", {}, "/es", false],
  ["/?lang=en", {}, "/en", false],
  ["/privacidad?lang=es", {}, "/es/privacidad", false],
  ["/privacidad?lang=en", {}, "/en/privacy", false],
  ...SLUGS.flatMap((slug) => [
    [`/proyectos/${slug}?lang=es`, {}, `/es/proyectos/${slug}`, false],
    [`/proyectos/${slug}?lang=en`, {}, `/en/projects/${slug}`, false],
    // Without ?lang=: always Spanish, whatever the visitor sends.
    [`/proyectos/${slug}`, {}, `/es/proyectos/${slug}`, false],
    [`/proyectos/${slug}`, { cookie: "language=en" }, `/es/proyectos/${slug}`, false],
  ]),
  ["/privacidad", {}, "/es/privacidad", false],
  ["/privacidad", { "accept-language": "en" }, "/es/privacidad", false],
  ["/privacidad?lang=fr", { cookie: "language=en" }, "/es/privacidad", false],
  // / without ?lang=: cookie, then Accept-Language, then /es.
  ["/", {}, "/es", true],
  ["/", { cookie: "language=en" }, "/en", true],
  ["/", { cookie: "language=es", "accept-language": "en" }, "/es", true],
  ["/", { "accept-language": "en-US,en;q=0.9" }, "/en", true],
  ["/", { "accept-language": "fr-FR,fr;q=0.9" }, "/es", true],
  ["/?lang=fr", { "accept-language": "en" }, "/en", true],
  // Other parameters stay, lang goes.
  ["/?utm_source=cv&lang=en", {}, "/en?utm_source=cv", false],
  ["/proyectos/libra?lang=es&utm_medium=pdf", {}, "/es/proyectos/libra?utm_medium=pdf", false],
  // Language crossings (next.config.ts).
  ["/en/privacidad", {}, "/en/privacy", false],
  ["/es/privacy", {}, "/es/privacidad", false],
  ...SLUGS.flatMap((slug) => [
    [`/en/proyectos/${slug}`, {}, `/en/projects/${slug}`, false],
    [`/es/projects/${slug}`, {}, `/es/proyectos/${slug}`, false],
  ]),
];

// global-not-found is experimental in Next.js 16.4.5: these must stay 404 and
// noindex if a Next.js update changes it. Unknown slugs never redirect.
const NOT_FOUND = [
  "/foo",
  "/foo/bar",
  "/fr",
  "/es/nope",
  "/en/projects/nope",
  "/en/proyectos/nope",
  "/es/projects/nope",
  "/proyectos/nope",
  "/proyectos/nope?lang=en",
];

const failures = [];
let linksChecked = 0;
let redirectsChecked = 0;
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

async function get(path, headers = {}) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual", headers });
  return { response, html: await response.text() };
}

// Location as path and query, whether the server sent it absolute or relative.
function locationOf(response) {
  const value = response.headers.get("location");
  if (!value) return null;
  const url = new URL(value, BASE);
  return url.origin === BASE ? `${url.pathname}${url.search}` : value;
}

const canonicalOf = (html) =>
  html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const isNoindex = (html) =>
  /<meta name="robots" content="[^"]*noindex/.test(html);

// Internal page links (not assets, API routes or hashes on the same page).
function pageLinks(html) {
  return [...html.matchAll(/<a [^>]*href="([^"]+)"/g)]
    .map((m) => m[1].replaceAll("&amp;", "&"))
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    .filter((href) => !/^\/(_next|api)\//.test(href))
    .filter((href) => !/\.[a-z0-9]+(\?|#|$)/i.test(href.split("?")[0]));
}
const isNewPath = (href) => /^\/(es|en)(\/|#|\?|$)/.test(href);

async function run() {
  for (const [path, canonical] of Object.entries(NEW_PAGES)) {
    const { response, html } = await get(path);
    check(response.status === 200, `${path}: status ${response.status}`);
    check(!response.headers.get("set-cookie"), `${path}: has Set-Cookie`);
    check(canonicalOf(html) === canonical, `${path}: canonical ${canonicalOf(html)}`);
    check(
      (html.match(/<link rel="alternate" hrefLang=/g) ?? []).length === 3,
      `${path}: expected 3 hreflang links`,
    );
    for (const href of pageLinks(html)) {
      linksChecked++;
      check(isNewPath(href), `${path}: links into the legacy routes (${href})`);
      check(!href.includes("lang="), `${path}: link with ?lang= (${href})`);
    }
  }

  // The sitemap lists exactly the pages above: none missing, none extra.
  const sitemap = await get("/sitemap.xml");
  check(sitemap.response.status === 200, `/sitemap.xml: status ${sitemap.response.status}`);
  const listed = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expectedUrls = Object.values(NEW_PAGES);
  for (const url of expectedUrls) {
    check(listed.includes(url), `/sitemap.xml: ${url} is missing`);
  }
  for (const url of listed) {
    check(expectedUrls.includes(url), `/sitemap.xml: unexpected ${url}`);
  }
  check(
    new Set(listed).size === listed.length,
    `/sitemap.xml: a URL is listed more than once`,
  );

  for (const [path, headers, expected, perVisitor] of REDIRECTS) {
    const label = `${path} ${JSON.stringify(headers)}`;
    const { response } = await get(path, headers);
    const location = locationOf(response);
    check(response.status === 307, `${label}: status ${response.status}, expected 307`);
    check(location === expected, `${label}: Location ${location}, expected ${expected}`);
    check(!location?.includes("lang="), `${label}: Location with lang=`);
    if (perVisitor) {
      check(
        /\bno-store\b/.test(response.headers.get("cache-control") ?? "") &&
          /\bprivate\b/.test(response.headers.get("cache-control") ?? ""),
        `${label}: Cache-Control ${response.headers.get("cache-control")}`,
      );
      const vary = response.headers.get("vary") ?? "";
      check(
        /\bCookie\b/i.test(vary) && /\bAccept-Language\b/i.test(vary),
        `${label}: Vary ${vary}`,
      );
    } else {
      // Same redirect for every visitor: no Vary on the cookie or language,
      // and a cookie only when the URL carries a valid ?lang=.
      const vary = response.headers.get("vary") ?? "";
      check(!/\b(Cookie|Accept-Language)\b/i.test(vary), `${label}: unexpected Vary ${vary}`);
      const hasLang = /[?&]lang=(es|en)(&|$)/.test(path);
      check(
        hasLang || !response.headers.get("set-cookie"),
        `${label}: Set-Cookie without a valid ?lang=`,
      );
    }
    if (!location) continue;
    redirectsChecked++;
    const target = await get(location, headers);
    check(
      target.response.status === 200,
      `${label}: destination ${location} answered ${target.response.status}, expected 200 with no further redirect`,
    );
  }

  for (const path of NOT_FOUND) {
    const { response, html } = await get(path);
    check(response.status === 404, `${path}: status ${response.status}, expected 404`);
    check(isNoindex(html), `${path}: 404 without noindex`);
  }
}

// If our server stopped (for example, the port is taken), another server may
// be answering on that port: do not test it by mistake.
function assertServerRunning() {
  if (server.exitCode !== null) {
    throw new Error(
      `next start exited with code ${server.exitCode}. Is port ${PORT} in use? Try SMOKE_PORT=<port>.`,
    );
  }
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    assertServerRunning();
    try {
      await fetch(`${BASE}/robots.txt`);
      // Give a server that failed to bind the port time to exit.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      assertServerRunning();
      return;
    } catch (error) {
      if (server.exitCode !== null) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`next start did not answer on ${BASE}`);
}

const server = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "start", "-p", PORT],
  { stdio: "ignore" },
);

try {
  await waitForServer();
  await run();
  assertServerRunning();
} finally {
  server.kill();
}

if (failures.length > 0) {
  console.error(`Smoke test failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `Smoke test passed (${Object.keys(NEW_PAGES).length} pages, ${redirectsChecked} redirects and ${linksChecked} internal links checked).`,
);
