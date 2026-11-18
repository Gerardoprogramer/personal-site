# Architecture

Decisions already taken in this repository, with their date and the pull request they come from. It records what was decided and why, not plans. Where something was not verified, it says so.

Sections 10 and 11 are copied word for word, in Spanish, from the measurement reports written on 2026-11-14.

## 1. What the site is, and what does not change

A bilingual (Spanish and English) personal portfolio that presents four projects as case studies.

Its identity is fixed. Changes to the code must leave these as they are:

- dark, editorial theme;
- serif headline, monospaced labels;
- large decorative letters behind the sections;
- the headline "Del problema real al software que lo resuelve";
- a sober, honest tone: every case study has a "Current scope" section that says what is missing;
- both languages, with the same content;
- the case study structure.

## 2. Map of the repository

| Path | What it holds |
| --- | --- |
| `app/[lang]/` | The site. Root layout, home page, case studies and privacy policy, one folder per translated segment |
| `app/(legacy)/` | The old `?lang=` routes. Temporary (section 4) |
| `app/api/contact/` | Contact form handler |
| `app/global-not-found.tsx` | 404 for URLs that match no route |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap and robots.txt |
| `components/pages/` | Page logic shared by the two language folders of each page |
| `components/layout/`, `sections/`, `projects/`, `shared/`, `seo/` | Interface |
| `content/` | Data without language: projects, profile, links, stack |
| `lib/routes.ts` | Every URL of the site |
| `lib/redirects.ts`, `proxy.ts` | Redirects from the old URLs |
| `lib/seo.ts`, `lib/structured-data.ts` | Canonical, hreflang, Open Graph, JSON-LD |
| `lib/sections.ts` | Home page sections and which one the navigation marks |
| `lib/language-cookie.ts` | Attributes of the `language` cookie |
| `lib/analytics.ts` | When Google Analytics may load |
| `lib/i18n/` | `es.json`, `en.json`, `projects.content.ts`, the language provider |
| `scripts/smoke.mjs` | Smoke test against the production build |

## 3. Routes

**One source for every URL.** `lib/routes.ts` defines a `RouteKey` (home, project with its slug, privacy) and `pathFor(route, lang)`. Internal links, the language switcher, the sitemap, the metadata and the redirects all build their URLs from it. `parsePath` is its inverse.

**Translated segments (2026-11-14, PR #25).** The path carries the language and the segment is translated: `/es/proyectos/libra` and `/en/projects/libra`, `/es/privacidad` and `/en/privacy`. Project slugs are proper names and are not translated. The alternative, the same Spanish segment under both prefixes, was simpler but left Spanish words in the English URLs.

**`app/[lang]` is a root layout.** It reads the language from the path, never from headers or the query string, so every page under it is prerendered. `dynamicParams = false` makes any other first segment a 404. Each translated folder generates only its own language, so `/en/proyectos/libra` is not a page (it redirects, section 4).

**`global-not-found` (2026-11-14, PR #25).** With a dynamic segment as root layout there is no single layout for a 404, so `app/global-not-found.tsx` renders it as a full document. It cannot know the visitor's language and shows both. It needs `experimental.globalNotFound`, which is experimental in Next.js 16.4.5; the smoke test fails if those URLs stop answering 404 with `noindex`.

## 4. Migration from `?lang=`

The site used to serve every page at one URL and choose the language from `?lang=`, then a cookie. Every page was rendered on each request, because the root layout read a request header. The migration moved the language into the path, in stages, so each stage could be reverted.

| Stage | Date, PR | What it did |
| --- | --- | --- |
| 1 | 2026-11-14, PR #25 | Added the `/es` and `/en` routes, prerendered. Moved the old routes into `app/(legacy)` with their own root layout. No redirects |
| 2 | 2026-11-14, PR #26 | Redirected the old URLs to the new ones, all with a temporary **307** |
| 3 | pending | Remove `app/(legacy)` and its support code. Decide which redirects become permanent |

**Why 307 and not 301.** A browser keeps a 301. With 307, reverting a stage takes effect at once. Making the redirects permanent is a separate decision for stage 3, and only for the redirects that are the same for every visitor.

**Only `/` negotiates the language** (PR #26). It uses the `language` cookie, then `Accept-Language`, then Spanish. Its response carries `Cache-Control: private, no-store` and `Vary: Cookie, Accept-Language`. An old case study or privacy URL without a valid `?lang=` always goes to Spanish, so its redirect is the same for everyone and carries no `Vary`.

**Where the redirects live.** `proxy.ts` handles the old URLs and runs only on `/`, `/proyectos/*` and `/privacidad`; it never runs on `/es` or `/en`, which stay static. `next.config.ts` handles a translated segment under the wrong prefix (`/en/proyectos/libra`).

**While `app/(legacy)` exists** it only renders the 404 of `/proyectos/<unknown slug>`: every other old URL redirects before reaching it.

## 5. Internationalization

Text lives in these places:

| Place | Content |
| --- | --- |
| `lib/i18n/es.json`, `en.json` | Interface, home page sections, experience, privacy policy, metadata |
| `lib/i18n/projects.content.ts` | The case studies in both languages, and their labels |
| `components/projects/ProjectFeature.tsx`, `AiPractice.tsx`, `ProjectCaseStudy.tsx` | Some case study text, written next to its markup |
| `lib/i18n/not-found.ts` | The 404 text |
| `lib/seo.ts` | The job title used in Open Graph and JSON-LD |

**What keeps the languages in step.**

- TypeScript: `en.json` must have every key of `es.json`, and every project must have its required fields in both languages.
- `lib/i18n/parity.test.ts`: the same keys including optional ones, lists of the same length, no empty text, and no text identical in both languages unless it is in an explicit list of names, brands and technologies.

**The provider.** `lib/i18n/context.tsx` gives components the dictionary, the language and a function that builds links in the current scheme. The home page sections read it through a hook, so they are client components.

## 6. Content

- A project is one entry in `content/projects.ts` plus its text in `lib/i18n/projects.content.ts`. The README lists the steps to add one and the check that catches each missed step.
- `ProjectFeature.tsx` has one `case` per slug, and a missing one fails type-checking.
- Libra's figures (tests run in CI, tests defined, commits) are written by hand in the hero line, the case study and the AI section. They are static and dated 2026-11-14 (PR #21). `content/libra-figures.test.ts` checks that they agree with each other; it cannot check that they are still current.

## 7. SEO

Decisions from PR #8, PR #23 and PR #25:

- **Canonical:** each page's own `/es` or `/en` URL, on the `www` host.
- **hreflang:** `es`, `en` and `x-default`. `x-default` is the site root, because the root chooses the language.
- **Sitemap:** the 12 pages, each with its three alternates. The root is not listed: it redirects.
- **JSON-LD:** every value is also visible on the page that carries it. The full `Person` (job title, core stack) is only on the home page; other pages carry the fields shown in the header and footer, with the same `@id`. Each case study adds a `SoftwareApplication`, or a `CreativeWork` for Selvática, which is a website. `inLanguage` is stated only for Libra, the only page that names the product's languages.
- **Not expected:** a rich result for `SoftwareApplication`. Google needs offers and ratings for it, and the pages show neither.

## 8. Security and privacy

**Headers** (`next.config.ts`), on every response: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and a Content Security Policy.

**The CSP is in Report-Only mode.** The browser reports violations in its console and blocks nothing. `script-src` allows `'unsafe-inline'`. Removing it needs a nonce per request, and a nonce per request makes every page dynamic, which would give up the prerendering and CDN caching that the migration achieved. The policy has no reporting endpoint, so moving it to enforcing mode needs a manual check of the console in production first. Not done yet.

**`language` cookie** (`lib/language-cookie.ts`). Value `es` or `en`, one year, `Path=/`, `SameSite=Lax`, and `Secure` over HTTPS. Written by the proxy when a URL has a valid `?lang=`, and by the language switcher. Read only to choose the language of `/`.

**Google Analytics** (`lib/analytics.ts`, `components/layout/CookieConsent.tsx`). Not part of the document. The cookie banner adds it only after the visitor accepts; before a choice and after a rejection the page makes no request to Google. The choice is kept in `localStorage` under `cookie-consent`, not in a cookie. When it loads, consent starts as denied and only `analytics_storage` is granted.

**When the cookie banner appears (2026-11-18)** (`lib/consent-banner.ts`). The banner is fixed to the bottom of the viewport, and on a first visit it covered the hero's three actions and its availability line at 390×844, 360×740, 375×667, 414×896 and 1280×720. Reserving space under the hero was the first idea and was discarded: padding below the hero does not move anything above it, and at 375×667 the availability line ends at y=800 with no banner at all. The banner now waits until that line, marked `data-consent-anchor`, has scrolled out of view above; pages without it show the banner at once. Nothing is asked or loaded before a choice, so delaying the question does not change what reaches Google. While it is shown, a spacer after the footer reserves its height; it is added below everything else, so no visible element moves (CLS 0 measured on all five sizes, before and after accepting or rejecting).

**Contact form** (`app/api/contact/route.ts`). The server validates with Zod, checks the `Origin`, limits each IP address to 5 submissions every 10 minutes, rejects a filled honeypot and rejects bodies over 10,000 characters. The message goes by email through Resend. There is no database.

Known limits: the rate limiter is in memory, per server instance, so on serverless hosting it slows abuse down but is not a global limit; it is skipped when the request has no IP address.

**The privacy policy** states only what the code shows. Retention periods, the legal basis and the Google Analytics configuration are not in the code and are the author's to state.

## 9. Tests and CI

CI (`.github/workflows/ci.yml`) runs on every pull request and on pushes to `master`: install with a frozen lockfile, lint with no warnings allowed, type check, unit tests, `pnpm audit --audit-level=high`, build, smoke test.

| Layer | Covers |
| --- | --- |
| Unit tests (Vitest, Node environment) | Routes, redirects and the proxy, metadata, sitemap, JSON-LD, the contact API, the language cookie, the analytics decision, the active section, translation parity, referenced public files, Libra's figures |
| Smoke test (`scripts/smoke.mjs`) | Against the production build: the 12 pages (status, canonical, hreflang, no `Set-Cookie`, internal links), the sitemap, every redirect as a single 307 to a 200 page, and the 404 pages |

Not covered by any test: components and hooks in a browser, external links, accessibility, performance, and the contact form and cookie banner as the visitor uses them.

## 10. Performance: measurements of 2026-11-14

Copied word for word from the measurement report of 2026-11-14. Three lines were left out: two local file paths and a note about that work session.

Fecha: 2026-11-14 (UTC) · Objetivo: `https://www.gerardomartinez.dev` (producción) · Máquina: Windows 11, una sola conexión doméstica · El repo no se modificó.

**Datos de laboratorio:** todo lo que hay aquí se midió desde esta máquina y esta conexión. No son datos de usuarios reales (ver §4).

### 1. TTFB con curl (tarea A)

**Método:**
- Herramienta: `curl.exe` 8.22.0 (Schannel), solo `GET`, con `-w` para `time_namelookup`, `time_connect`, `time_appconnect`, `time_starttransfer`, `time_total` y `size_download`. La cabecera `x-vercel-cache` se leyó de `-D`.
- Secuencia por URL, de 20:23:30 a 20:31:15 UTC:
  1. espera de 65 s sin ninguna petición;
  2. **1 petición fría**;
  3. **10 peticiones calientes**, separadas por 2 s.
- En total, 55 peticiones.
- Cada `curl.exe` abre una conexión nueva, así que el TTFB **incluye DNS, TCP y TLS**. La columna «Espera del servidor» es `time_starttransfer − time_appconnect`: el tiempo desde que termina el TLS hasta el primer byte.
- curl no envía `Accept-Encoding`, así que el HTML se descargó sin comprimir (`size_download`: 70 847 B en `/es`).
- No registré `x-vercel-id`, así que no sé qué región de Vercel respondió.

#### 1.1 Pasada caliente (n = 10 por URL), en ms: mediana [mín–máx]

| URL | TTFB (`time_starttransfer`) | Total (`time_total`) | TLS terminado (`time_appconnect`) | Espera del servidor | `x-vercel-cache: HIT` |
|---|---|---|---|---|---|
| `/es` | 396 [332–473] | 481 [416–581] | 259 [213–322] | 144 [119–159] | 10/10 |
| `/en` | 392 [331–564] | 477 [416–1107] | 262 [214–396] | 132 [118–168] | 10/10 |
| `/es/proyectos/libra` | 404 [365–432] | 490 [450–537] | 264 [216–305] | 133 [120–158] | 10/10 |
| `/en/projects/libra` | 410 [335–734] | 519 [417–830] | 259 [209–329] | 150 [126–405] | 10/10 |
| `/es/privacidad` | 384 [342–428] | 469 [426–541] | 247 [216–291] | 132 [123–160] | 10/10 |

#### 1.2 Pasada fría (n = 1 por URL, tras esperar 65 s), en ms

| URL | TTFB | Total | DNS (`time_namelookup`) | Espera del servidor | `x-vercel-cache` |
|---|---|---|---|---|---|
| `/es` | 474 | 562 | 125 | 134 | HIT |
| `/en` | 421 | 507 | 6 | 136 | HIT |
| `/es/proyectos/libra` | 353 | 440 | 6 | 132 | HIT |
| `/en/projects/libra` | 454 | 539 | 111 | 128 | HIT |
| `/es/privacidad` | 419 | 504 | 7 | 132 | HIT |

- **Caché:** las 55 peticiones, frías y calientes, dieron `HIT`. Esperar 65 s no vació la caché de Vercel. La pasada «fría» solo es fría en lo que toca a la conexión, y a veces al DNS (125 ms y 111 ms en dos URLs).
- **Con n = 1, la pasada fría no permite sacar conclusiones** sobre la diferencia con la caliente.
- **Atípicos:**
  - `/en` warm 3: total de 1107 ms, con un TTFB de 564 ms.
  - `/en/projects/libra` warm 8: TTFB de 734 ms, con DNS de 112 ms y espera de 405 ms.

### 2. Comparación con «antes» (tarea B)

Las únicas cifras de antes son **una sola muestra GET** de producción, tomada en un día anterior con el despliegue `c749fc9` (plan §2.3, región `iad1`, respuesta en br).

| Página | Antes (1 muestra) | Ahora (mediana caliente, n = 10) | Ahora (fría, n = 1) |
|---|---|---|---|
| Home ES | `/?lang=es`: 1,089 s, MISS | `/es`: 0,396 s [0,332–0,473], HIT | 0,474 s |
| Home EN | `/?lang=en`: 0,487 s, MISS | `/en`: 0,392 s [0,331–0,564], HIT | 0,421 s |
| Caso Libra ES | `/proyectos/libra?lang=es`: 0,857 s, MISS | `/es/proyectos/libra`: 0,404 s [0,365–0,432], HIT | 0,353 s |
| `/` | 0,398 s, 200, MISS | no medido: `/` ahora es un 307 sin cuerpo y no es comparable | — |

**Esto no demuestra una mejora.** El «antes» es una muestra única, sin rango ni mediana. No sé si incluía DNS, TCP y TLS, ni la compresión, ni la región exacta de esta medición. La diferencia de condiciones puede explicar una parte desconocida de la diferencia. Lo único que se puede afirmar con datos es el cambio de caché: antes era `MISS` con `private, no-store`, y ahora es `HIT` en 55 de 55 peticiones.

### 3. Lighthouse móvil (tarea C)

**Método:**
- Herramienta: `npx --yes lighthouse@13.6.0` con su configuración por defecto: `formFactor=mobile`, `throttlingMethod=simulate` con RTT de 150 ms, 1638,4 kbps y CPU ×4.
- Navegador: Chrome 157 local con `--headless=new`.
- 5 rondas × 3 URLs, intercaladas, de 20:31:23 a 20:36:42 UTC, justo después de la tarea A.
- `benchmarkIndex` de la máquina: entre 1959,5 y 2733,5 según la ejecución.
- **Analytics bloqueado:** usé `--blocked-url-patterns` para `*googletagmanager.com*`, `*google-analytics.com*` y `*analytics.google.com*`. En los 15 informes, el único host externo es `www.googletagmanager.com/gtag/js`, que aparece 30 veces con `status=-1` y `transferSize=0`: bloqueado, no se descargó nada. Por eso la página medida es algo más ligera que la que reciben los visitantes, que sí cargan gtag.
- Ninguna ejecución tuvo `runtimeError` ni `runWarnings`. La URL final fue siempre la pedida.

#### 3.1 Resultados (n = 5 por URL): mediana [mín–máx]

| Métrica | `/es` | `/en` | `/es/proyectos/libra` |
|---|---|---|---|
| Rendimiento | 96 [89–98] | 97 [94–97] | 89 [88–89] |
| Accesibilidad | 100 [100–100] | 100 [100–100] | 100 [100–100] |
| Buenas prácticas | 100 [100–100] | 100 [100–100] | 100 [100–100] |
| SEO | 100 [100–100] | 100 [100–100] | 100 [100–100] |
| LCP (ms) | 1781 [1747–2241] | 1776 [1737–1791] | 3112 [3082–3160] |
| CLS | 0,000 [0,000–0,000] | 0,000 [0,000–0,000] | 0,000 [0,000–0,000] |
| TBT (ms) | 182 [115–304] | 160 [126–251] | 236 [225–245] |
| FCP (ms), como referencia | 1781 [1747–2241] | 1776 [1737–1791] | 1627 [1582–1662] |

- **Libra:** su LCP (≈3,1 s) es bastante más alto que su FCP (≈1,6 s), a diferencia de las homes, donde LCP y FCP coinciden. No analicé qué elemento es el LCP. El dato está en los JSON.
- **SEO:** no hay ninguna auditoría puntuada por debajo de 1 en Accesibilidad, Buenas prácticas ni SEO en ninguna ejecución. El SEO de 100 incluye la indexabilidad: no hay `noindex` en producción.

### 4. Limitaciones (tarea D)

- **Son datos de laboratorio**, medidos desde una sola máquina Windows y una sola conexión. No son datos de usuarios reales. Otra red, otro dispositivo u otra región darán otras cifras.
- **Lighthouse simula** un móvil (throttling `simulate`). Sus LCP y TBT son estimaciones de laboratorio, no Core Web Vitals.
- **Los Core Web Vitals de campo** (LCP, INP y CLS de visitantes reales) solo se ven en Search Console (informe de Core Web Vitals, datos de CrUX) o en Vercel Speed Insights, y solo cuando hay tráfico suficiente. No los he consultado.
- **El TTFB de curl** incluye la conexión completa en cada petición. Un navegador que reutiliza la conexión vería menos.
- **Lighthouse midió sin Google Analytics** (bloqueado a propósito, ver §3).

## 11. LCP changes that were tested and discarded (2026-11-14)

Three changes to lower the LCP of `/es/proyectos/libra` were tested on the branch `perf/libra-lcp` and none was kept, so there is no pull request. Copied word for word from the report of 2026-11-14. One line with local file paths was left out.

Fecha: 2026-11-14 (UTC) · Rama `perf/libra-lcp`, creada desde master `7b24565`. **No se conservó ningún cambio**, así que no hay commits ni PR (ver §5).

Leyenda: **[MEDIDO]** = salido de una ejecución de esta sesión. Todo es laboratorio en localhost.

### 1. Método

- **Builds:** `next build` y `next start` en local, en dos *git worktrees* temporales fuera del repo (`scratchpad/wt-base` y `wt-test`), sin archivos `.env`. Ambos se instalaron con el mismo `pnpm-lock.yaml`. La línea base («A») es master `7b24565`. La variante («B») es master más el cambio. Los dos servidores corren a la vez: A en `:3301` y B en `:3302`.
- **Lighthouse:** `npx --yes lighthouse@13.6.0` con el perfil móvil por defecto (`formFactor=mobile`, `throttlingMethod=simulate`: RTT de 150 ms, 1638,4 kbps, CPU ×4), Chrome 157 con `--headless=new` y bloqueo de `*googletagmanager.com*`, `*google-analytics.com*` y `*analytics.google.com*`.
- **Secuencia:** antes de empezar se calienta cada servidor con un GET a cada página. Luego, 5 rondas. En cada ronda se mide `/es/proyectos/libra` y `/es`, alternando A y B. Las rondas impares van en orden A→B y las pares en B→A. En total, 20 ejecuciones por cambio, sin otras tareas pesadas a la vez.
- **Métricas:** mediana [mín–máx] de 5 ejecuciones. Rendimiento, LCP, FCP, CLS, TBT y peso transferido (`total-byte-weight`). La columna «prioridad de la imagen» sale de `network-requests` (`priority`).
- **Criterio para conservar un cambio:** el rango de LCP de B no se solapa con el de A en Libra, y no empeoran TBT, CLS ni la puntuación de `/es`.
- **Comprobaciones con cada cambio aplicado** [MEDIDO, igual en los dos]:
  - `pnpm lint`: 0 errores, 1 aviso previo en `Header.tsx`.
  - `tsc --noEmit`: OK.
  - `pnpm test`: 7 archivos, 194 pruebas OK.
  - `pnpm build`: OK, Libra sigue ● SSG.
  - `node scripts/smoke.mjs`: `Smoke test passed (41 redirects and 126 internal links checked).`

### 2. Cambio 1: `fetchPriority={eager ? "high" : undefined}` en `ProjectImage.tsx`. DESCARTADO

Mediciones del 2026-11-14, desde las 21:10:42 UTC.

| Página | Lado | Rendimiento | LCP (ms) | FCP (ms) | CLS | TBT (ms) | Peso | Prioridad de la imagen de Libra |
|---|---|---|---|---|---|---|---|---|
| Libra | A (master) | 88 [87–89] | 3732 [3730–3845] | 1538 [1537–1552] | 0 [0–0] | 94 [39–107] | 380,1 KiB | High 1/5, Low 4/5 |
| Libra | B (cambio) | 88 [87–88] | **3811 [3806–3858]** | 1538 [1536–1549] | 0 [0–0] | 79 [75–95] | 380,1 KiB | **High 5/5** |
| `/es` | A | 100 [100–100] | 1537 [1536–1537] | 1537 [1536–1537] | 0 | 40 [37–45] | 438,4 KiB | Low (fuera de pantalla) |
| `/es` | B | 100 [100–100] | 1538 [1536–1539] | 1538 [1536–1539] | 0 | 42 [40–56] | 438,4 KiB | Low |

**Resultado:** los rangos de LCP se solapan (3806–3858 frente a 3730–3845) y la mediana de B es 79 ms peor. El cambio hace lo previsto en la red: la imagen pasa a pedirse siempre con prioridad `High`. Pero el LCP simulado no baja. **Descartado.**

### 3. Cambio 2: `preload: false` en alguna fuente de `lib/fonts.ts`. NO SE APLICÓ

Primero había que demostrar si alguna familia no se usa en la primera pantalla.

**Evidencia [MEDIDO]:** Chrome 157 headless local por CDP, viewport de 412×823 a 1,75× con `mobile: true` (el de Lighthouse), GA bloqueado y build de master en `localhost:3301`. Recorrí los nodos de texto visibles dentro de la primera pantalla, sin scroll, y anoté la primera familia de `font-family`.

| Página | Inter | Fraunces | Geist Mono |
|---|---|---|---|
| `/es` | 13 nodos, p. ej. «Soy desarrollador full stack» (top 422) y la navegación inferior (top 781) | 5 nodos: «G» de la marca (top 32), el `h1` «Del problema real» (top 187) | 11 nodos: selector «ES/EN» (top 37), «Gerardo Martínez Monge» (top 145), «3 proyectos desplegados…» (top 356) |
| `/es/proyectos/libra` | 15 nodos, p. ej. «Todos los proyectos» (top 126) y la navegación inferior | 3 nodos: «G» (top 32), «Libra» (top 224), el `h1` (top 271) | 6 nodos: selector «ES/EN» (top 37), `eyebrow` «Proyecto personal…» (top 189) y el banner de cookies |

Las 3 familias se pintan en la primera pantalla de las dos páginas, así que quitar el *preload* de cualquiera retrasaría texto visible. **Por eso no se tocó `lib/fonts.ts`.** Tampoco se midió con Lighthouse.

Nota sobre el método: el `resize_window` de la extensión de Chrome no cambió el viewport (`innerWidth` seguía en 1536). El `iframe` tampoco sirvió, porque `X-Frame-Options: DENY` lo bloquea. Por eso se usó Chrome headless.

### 4. Cambio 3: diálogo de zoom con `dynamic()` (`ImageDialog.tsx` nuevo, `ssr: false`). DESCARTADO

**Funcionalidad comprobada en Chrome** [MEDIDO, `localhost:3302`]:
- Teclado:
  - Enter y Espacio abren el diálogo.
  - Al abrir, el diálogo es modal (`:modal`) y el foco cae en «Cerrar imagen». El fondo es inerte: no se le puede dar el foco.
  - Escape y Enter en «Cerrar imagen» lo cierran, lo desmontan y devuelven el foco al botón que lo abrió.
- Ratón: el clic en la imagen lo abre y el clic en el fondo lo cierra.
- El código del diálogo se descarga al primer clic (chunk `1vv258_e5uxlq.js`).
- Tab desde «Cerrar imagen» saca el foco al navegador (`BODY`) y Shift+Tab lo devuelve. Es el comportamiento nativo de un `<dialog>` modal con un solo control, igual que en master.

**Medición** (2026-11-14, desde las 21:30:34 UTC):

| Página | Lado | Rendimiento | LCP (ms) | FCP (ms) | CLS | TBT (ms) | Peso |
|---|---|---|---|---|---|---|---|
| Libra | A (master) | 88 [88–88] | 3731 [3729–3822] | 1537 [1537–1541] | 0 | 90 [76–114] | 380,1 KiB |
| Libra | B (cambio) | 88 [88–89] | 3730 [3725–3815] | 1537 [1536–1539] | 0 | 79 [41–98] | **381,4 KiB** |
| `/es` | A | 100 [88–100] | 1538 [1536–3877] | 1537 [1536–1538] | 0 | 46 [42–50] | 438,4 KiB |
| `/es` | B | 100 [88–100] | 1537 [1536–3876] | 1536 [1536–1537] | 0 | 42 [36–48] | 438,4 KiB |

**Resultado:** el LCP es prácticamente igual (3731 frente a 3730 ms, rangos solapados) y el peso inicial de Libra sube 1,3 KiB, porque el chunk extra cuesta más que lo que ahorra. **Descartado.**

**Atípico en `/es`:** en la ronda 5, A y B dieron a la vez un LCP de 3877 y 3876 ms, con el mismo elemento (`div.section-letter > span`). Como aparece en los dos lados de la misma ronda, se atribuye al estado de la máquina, no al cambio. Por eso el criterio se aplica a rangos de A frente a B medidos en las mismas rondas.

### 5. Resultado final

- **Ningún cambio cumplió el criterio.** No hay commits ni push, y no hay PR: GitHub no permite abrir una PR sin cambios.
- La rama local `perf/libra-lcp` sigue en `7b24565`, idéntica a master. Se puede borrar con `git branch -d perf/libra-lcp`.
- No toqué `browserslist` ni AVIF, como se pidió.
- **Línea base en localhost:** el LCP simulado de Libra es de unos 3,73 s. En producción era de 3,11 s (`portfolio-medicion-informe.md`). La diferencia se debe al entorno: el servidor local (`next start`) frente al CDN de Vercel.

### 6. Limitaciones

- **Laboratorio, una sola máquina** (Windows 11, Chrome 157). No son datos de usuarios reales.
- **Localhost, sin la latencia real de Vercel:** el TTFB y la entrega de estáticos son los de `next start` local. El throttling `simulate` aplica una red simulada sobre esa traza.
- **El LCP de Lighthouse en modo `simulate` es una estimación** (Lantern). Un cambio de prioridad que el navegador sí aplica puede no reflejarse en ella. Con `throttlingMethod=devtools` o en datos de campo el resultado podría ser distinto. No lo medí.
- **n = 5 por lado:** con esa muestra, el criterio de rangos sin solape solo detecta efectos grandes.
- **Uso de red de esta sesión fuera de localhost:** `pnpm install --prefer-offline` en los worktrees descargó del registro de npm los 11 paquetes que faltaban en el store, con el mismo lockfile y sin dependencias nuevas. `npx lighthouse@13.6.0` se ejecutó con tu permiso. No hubo peticiones a producción ni a la vista previa.

## 12. Operation

**Environment variables.** `RESEND_API_KEY` and `CONTACT_TO_EMAIL`, both for the contact form. They are read on the first submission, not at start-up. Names in `.env.example`; values only in the hosting provider and in a local `.env.local`.

**Deployment.** Vercel, from `master`. The canonical host is `https://www.gerardomartinez.dev`. The domain without `www` redirects to it with a 308 issued by Vercel, so an old URL on that host takes two hops: that 308, then the site's 307.

**Reverting.** Each stage of the migration is one merged pull request: `git revert -m 1 <merge commit>` on a new branch, then a pull request. Because the redirects are 307, browsers keep none of them. Not verified: whether Vercel's Instant Rollback is available on this account.
