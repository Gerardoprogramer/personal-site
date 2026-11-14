// Smoke test against the production build: starts `next start`, requests the
// legacy and the /es and /en URLs, and fails on any unexpected status, missing
// noindex on a 404, redirect, wrong canonical, Set-Cookie on a prerendered
// page, or a link from one route group into the other.
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

// Legacy URLs: same 200 response as before stage 1, canonical on the new URL.
const LEGACY_PAGES = {
  "/?lang=es": `${ORIGIN}/es`,
  "/?lang=en": `${ORIGIN}/en`,
  "/proyectos/libra?lang=es": `${ORIGIN}/es/proyectos/libra`,
  "/proyectos/libra?lang=en": `${ORIGIN}/en/projects/libra`,
  "/privacidad?lang=es": `${ORIGIN}/es/privacidad`,
  "/privacidad?lang=en": `${ORIGIN}/en/privacy`,
};

// global-not-found is experimental in Next.js 16.4.5: these must stay 404 and
// noindex if a Next.js update changes it.
const NOT_FOUND = [
  "/foo",
  "/foo/bar",
  "/fr",
  "/es/nope",
  "/en/projects/nope",
  "/en/proyectos/libra",
  "/es/privacy",
  "/proyectos/nope",
];

const failures = [];
let linksChecked = 0;
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

async function get(path) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { response, html: await response.text() };
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

  for (const [path, canonical] of Object.entries(LEGACY_PAGES)) {
    const { response, html } = await get(path);
    check(response.status === 200, `${path}: status ${response.status}`);
    check(canonicalOf(html) === canonical, `${path}: canonical ${canonicalOf(html)}`);
    for (const href of pageLinks(html)) {
      linksChecked++;
      check(!isNewPath(href), `${path}: links into the /es or /en routes (${href})`);
    }
  }

  const root = await get("/");
  check(root.response.status === 200, `/: status ${root.response.status}`);

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
console.log(`Smoke test passed (${linksChecked} internal links checked).`);
