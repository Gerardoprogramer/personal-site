# Gerardo Martínez Monge — Personal Portfolio

Bilingual personal portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**.

The site presents selected software projects as detailed case studies, together with professional experience, technical background, services, and contact information.

**Live site:** https://www.gerardomartinez.dev

For the decisions behind the code (routes, the migration from `?lang=`, i18n, SEO, security, measurements), see [docs/architecture.md](docs/architecture.md).

---

## Overview

Rather than displaying projects as simple cards or screenshots, the portfolio presents each project as a case study focused on:

- the problem being solved;
- product and engineering decisions;
- technical implementation;
- current scope;
- testing and verification;
- links to live demos and source code when available.

The portfolio is available in both **Spanish and English**.

---

## Featured Projects

### Libra

A bilingual digital library of classic literature: catalog, chapter reader, and reading progress that is kept even when the text changes.

**Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Drizzle, Cloudflare R2

**Live demo:** https://www.alyvenor.com/en

---

### La Central

A custom **ERP + POS** designed around the real operation of a grocery store in Costa Rica.

It covers:

- sales;
- weighted products;
- inventory;
- cash management;
- purchasing;
- customer credit;
- supplier balances;
- backups and recovery;
- multiple browser-based registers on a local network.

**Stack:** React, TypeScript, NestJS, Prisma, PostgreSQL, Docker

The project is designed for local deployment and does not depend on Internet connectivity for daily operation.

---

### Obsidian Library

A full-stack library management platform for readers and administrators.

Key areas include:

- book catalog;
- loans and returns;
- reservations;
- wishlists and reviews;
- fines;
- membership plans;
- Stripe payments;
- administrative workflows;
- authentication and authorization.

**Frontend:** Next.js, TypeScript, React Query  
**Backend:** Java 21, Spring Boot, PostgreSQL

**Live demo:** https://library.gerardomartinez.dev

---

### Selvática

A conceptual hospitality website inspired by the rainforest and volcanic landscape of Arenal, Costa Rica.

The project explores:

- editorial web design;
- responsive composition;
- image-driven storytelling;
- motion and transitions;
- accessible interaction patterns;
- desktop and mobile experiences.

**Stack:** Next.js, React, TypeScript, Tailwind CSS, Motion

**Live demo:** https://selvatica.gerardomartinez.dev

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Validation | Zod |
| Email | Resend + React Email |
| Internationalization | Custom ES / EN implementation |
| Analytics | Google Analytics, loaded only after consent |
| Tests | Vitest, plus a smoke test against the production build |
| Deployment | Vercel |

---

## Architecture

The project uses the **Next.js App Router**.

```text
app/
├── [lang]/                   # The site: /es and /en, prerendered
│   ├── layout.tsx            # Root layout and site metadata
│   ├── page.tsx              # Home page
│   ├── proyectos/[slug]/     # Case studies in Spanish
│   ├── projects/[slug]/      # Case studies in English
│   ├── privacidad/           # Privacy policy in Spanish
│   └── privacy/              # Privacy policy in English
├── (legacy)/                 # Old ?lang= routes. Temporary, see docs/architecture.md
├── api/contact/              # Contact form API
├── global-not-found.tsx      # 404 for URLs that match no route
├── robots.ts
└── sitemap.ts

components/
├── layout/                   # Header, footer, cookie consent
├── pages/                    # Page logic shared by the two language folders
├── projects/                 # Case study components
├── sections/                 # Home page sections
├── seo/                      # JSON-LD
└── shared/                   # Reusable UI elements

content/                      # Data without language: projects, profile, stack
lib/
├── routes.ts                 # Every URL of the site comes from here
├── redirects.ts              # Old URLs -> /es and /en
├── seo.ts, structured-data.ts
├── sections.ts               # Home sections and the active-section rule
├── analytics.ts              # When Google Analytics may load
└── i18n/                     # es.json, en.json, projects.content.ts
proxy.ts                      # Redirects the old URLs (Next.js 16 "proxy")
scripts/smoke.mjs             # Smoke test against the production build
```

---

## Routes and languages

The language is part of the path, and the path segments are translated. Project slugs are proper names and stay the same.

| Page | Spanish | English |
| --- | --- | --- |
| Home | `/es` | `/en` |
| Case study | `/es/proyectos/<slug>` | `/en/projects/<slug>` |
| Privacy policy | `/es/privacidad` | `/en/privacy` |

All 12 pages (home, 4 case studies and the privacy policy, in 2 languages) are prerendered.

### Redirects

The site used to choose the language with `?lang=es` or `?lang=en`. Those URLs still work: they redirect, with a temporary **307**, to the new path.

| Old URL | Goes to |
| --- | --- |
| `/?lang=en` | `/en` |
| `/proyectos/libra?lang=en` | `/en/projects/libra` |
| `/privacidad?lang=en` | `/en/privacy` |
| `/proyectos/libra`, `/privacidad` (no `lang`) | the Spanish page |
| `/` | `/es` or `/en`: the `language` cookie, then `Accept-Language`, then Spanish |
| `/en/proyectos/libra` (segment of the other language) | `/en/projects/libra` |

The language switcher stores the choice in a `language` cookie for one year, so `/` opens in the same language next time.

---

## Project Case Studies

Each case study can include:

- project context;
- role and scope;
- engineering decisions;
- implementation evidence;
- technologies;
- screenshots;
- source repositories;
- live demo links.

### Adding a project

1. `content/projects.ts`: add the slug to `ProjectSlug` and the entry to `projects`. The order of the array is the order of the cards and of "next project".
2. `lib/i18n/projects.content.ts`: write the case study in `es` and `en`.
3. `lib/structured-data.ts`: choose its schema.org type in `projectSchema`.
4. `components/projects/ProjectFeature.tsx`: add a `case` for the slug (return `null` if it has no feature block).
5. `public/projects/`: add the cover and set its real width and height in `content/projects.ts`.
6. `components/projects/ProjectCaseStudy.tsx`: add a caption for the cover if the generic one does not fit.
7. Update the text that counts projects: `hero.proof` and `projectsSection` in `lib/i18n/es.json` and `en.json`, and the `meta` descriptions.
8. Update the lists in `lib/routes.test.ts`, `lib/seo.test.ts` and `lib/routes-metadata.test.ts`.

Routes, sitemap, redirects and static generation follow `content/projects.ts` on their own.

What catches a missed step:

| If you forget… | …this fails |
| --- | --- |
| steps 2, 3 or 4 | `pnpm exec tsc --noEmit` |
| a translation, an optional field in one language, or a list of a different length | `lib/i18n/parity.test.ts` |
| the cover file, or its declared size | `content/public-files.test.ts` |
| step 8 | the tests themselves |

The smoke test needs no edit: it reads the slugs from `content/projects.ts` and checks the new pages and the sitemap. Steps 6 and 7 have no automatic check.

---

## SEO

The portfolio includes:

- a canonical URL per page (its own `/es` or `/en` URL);
- language alternates (`es`, `en` and `x-default`, which is the site root);
- Open Graph metadata and Twitter cards;
- per-project metadata and Open Graph previews using the project images;
- a sitemap with the 12 pages;
- `robots.txt`;
- structured data using JSON-LD: a `Person` on every page, and a `SoftwareApplication` or `CreativeWork` on each case study.

---

## Accessibility

Accessibility is considered throughout the interface.

Examples include:

- semantic HTML;
- keyboard navigation;
- visible focus behavior;
- skip-to-content navigation;
- native dialogs for image viewing;
- focus restoration;
- descriptive image alternative text;
- reduced-motion support;
- responsive layouts for desktop and touch devices.

Automated accessibility scores are treated as supporting evidence rather than a replacement for manual accessibility checks.

---

## Analytics and Privacy

The site integrates **Google Analytics** with consent management.

Google Analytics is not part of the page. It is loaded only after the visitor accepts it in the cookie banner; before a choice, and after a rejection, the site makes no request to Google. The choice is kept in the browser's local storage.

The portfolio also includes a privacy policy explaining:

- analytics usage;
- contact form data;
- cookies and local storage;
- data handling;
- user rights.

---

## Contact Form

The contact form is implemented through a Next.js Route Handler:

```text
POST /api/contact
```

The server validates incoming data with **Zod** before sending the message through **Resend**.

Validation includes:

- name length, and no control characters;
- valid email address;
- contact intent;
- message length.

The handler also checks the request `Origin`, limits each IP address to 5 submissions every 10 minutes (in memory, per server instance), and uses a hidden honeypot field to reject basic automated submissions.

Email delivery uses **React Email** for the message template.

---

## Images

Project screenshots are stored under:

```text
public/projects/
```

Images are rendered using Next.js image optimization where appropriate.

Remote images are restricted through `next.config.ts`.

Screenshots associated with La Central use demonstration data.

---

## Running Locally

### Requirements

- Node.js 22 (the version CI uses)
- pnpm 10

Clone the repository:

```bash
git clone https://github.com/Gerardoprogramer/personal-site.git
cd personal-site
```

Install dependencies:

```bash
pnpm install
```

### Environment variables

The contact form needs two variables. Their names are in [`.env.example`](.env.example); put the values in a `.env.local` file, which git ignores.

| Variable | Used for |
| --- | --- |
| `RESEND_API_KEY` | Sending the contact email through Resend |
| `CONTACT_TO_EMAIL` | The inbox that receives it |

The rest of the site works without them.

Start development:

```bash
pnpm dev
```

The development server is normally available at:

```text
http://localhost:3000
```

---

## Quality Checks

Before publishing changes:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
node scripts/smoke.mjs
```

These checks validate:

- ESLint rules, with no warnings allowed;
- TypeScript types;
- unit tests (Vitest): routes, redirects, metadata, sitemap, JSON-LD, the contact API, translation parity, referenced files and content figures;
- production compilation;
- the smoke test: it starts the production build and checks the 12 pages (status, canonical, hreflang, internal links), the sitemap, every redirect and the 404 pages.

The smoke test uses port 3100. If it is taken: `SMOKE_PORT=3187 node scripts/smoke.mjs`.

CI runs the same steps on every pull request, plus `pnpm audit --audit-level=high`.

---

## Deployment

The portfolio is deployed with **Vercel** using the custom domain:

https://www.gerardomartinez.dev

The application uses environment variables for external services such as Resend.

---

## Project Structure Philosophy

The portfolio intentionally separates:

```text
content
presentation
translations
routing
external integrations
```

instead of keeping project information directly inside page components.

The goal is to keep the codebase simple enough for a personal portfolio while still making project content, translations, and UI independently maintainable.

---

## Author

**Gerardo Martínez Monge**

Full Stack Developer · Business Informatics

Costa Rica

- Portfolio: https://www.gerardomartinez.dev
- GitHub: https://github.com/Gerardoprogramer
