// Smoke test against the production build: starts `next start`, requests the
// legacy and the /es and /en URLs, and fails on any unexpected status, missing
// noindex on a 404, redirect on a new page, wrong canonical, Set-Cookie on a
// prerendered page, link from the new routes into the legacy ones, or legacy
// redirect that is not a single 307 to the expected page.
//
// Usage: pnpm build && node scripts/smoke.mjs
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const PORT = process.env.SMOKE_PORT ?? "3100";
const BASE = `http://localhost:${PORT}`;
const ORIGIN = "https://www.gerardomartinez.dev";

const NEW_PAGES = {
  "/es": `${ORIGIN}/es`,
  "/en": `${ORIGIN}/en`,
  "/es/proyectos/libra": `${ORIGIN}/es/proyectos/libra`,
  "/en/projects/libra": `${ORIGIN}/en/projects/libra`,
  "/es/privacidad": `${ORIGIN}/es/privacidad`,
  "/en/privacy": `${ORIGIN}/en/privacy`,
};

const SLUGS = ["libra", "la-central", "obsidian-library", "selvatica"];

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
    [`/proyectos/${slug}`, {}, `/es/proyectos/${slug}`, true],
    [`/proyectos/${slug}`, { cookie: "language=en" }, `/en/projects/${slug}`, true],
  ]),
  // Without ?lang=: cookie, then Accept-Language, then /es.
  ["/", {}, "/es", true],
  ["/", { cookie: "language=en" }, "/en", true],
  ["/", { cookie: "language=es", "accept-language": "en" }, "/es", true],
  ["/", { "accept-language": "en-US,en;q=0.9" }, "/en", true],
  ["/", { "accept-language": "fr-FR,fr;q=0.9" }, "/es", true],
  ["/?lang=fr", { "accept-language": "en" }, "/en", true],
  ["/privacidad", {}, "/es/privacidad", true],
  ["/privacidad", { "accept-language": "en" }, "/en/privacy", true],
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

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`${BASE}/robots.txt`);
      return;
    } catch {
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
} finally {
  server.kill();
}

if (failures.length > 0) {
  console.error(`Smoke test failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `Smoke test passed (${redirectsChecked} redirects and ${linksChecked} internal links checked).`,
);
