# Gerardo Martínez Monge — Personal Portfolio

Bilingual personal portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**.

The site presents selected software projects as detailed case studies, together with professional experience, technical background, services, and contact information.

**Live site:** https://gerardomartinez.dev

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
| Analytics | Google Analytics with consent management |
| Deployment | Vercel |

---

## Architecture

The project uses the **Next.js App Router**.

Main areas are separated by responsibility:

```text
app/
├── api/
│   └── contact/          # Contact form API
├── proyectos/
│   └── [slug]/           # Dynamic project case studies
├── privacidad/           # Privacy policy
├── layout.tsx            # Global metadata and layout
├── robots.ts
└── sitemap.ts

components/
├── layout/               # Header, footer and cookie consent
├── projects/             # Project case study components
├── sections/             # Homepage sections
└── shared/               # Reusable UI elements

content/
├── projects.ts           # Project metadata
└── Experience.tsx        # Professional experience data

lib/
└── i18n/
    ├── context.tsx
    ├── es.json
    ├── en.json
    └── projects.content.ts

emails/
└── ContactEmail.tsx
```

Project metadata and translated project narratives are intentionally separated from presentation components.

This makes it possible to update content without embedding large amounts of copy directly inside UI components.

---

## Internationalization

The portfolio supports:

```text
Spanish
English
```

Language selection can be provided through:

```text
?lang=es
?lang=en
```

The selected language is persisted with a cookie.

The Next.js proxy resolves the active language and forwards it internally through the:

```text
x-language
```

request header.

This allows server-generated metadata and client-rendered content to stay aligned with the selected language.

---

## Project Case Studies

Each selected project has its own dynamic route:

```text
/proyectos/[slug]
```

Examples:

```text
/proyectos/obsidian-library
/proyectos/la-central
/proyectos/selvatica
```

Each case study can include:

- project context;
- role and scope;
- engineering decisions;
- implementation evidence;
- technologies;
- screenshots;
- source repositories;
- live demo links.

Project pages also generate their own metadata based on the selected language.

---

## SEO

The portfolio includes:

- dynamic metadata;
- canonical URLs;
- language alternates;
- Open Graph metadata;
- Twitter cards;
- per-project metadata;
- sitemap generation;
- `robots.txt`;
- structured data using JSON-LD.

The main site publishes a `Person` schema containing professional and technical information.

Project pages generate individual Open Graph previews using their project images.

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

Analytics storage defaults to:

```text
denied
```

until the visitor explicitly accepts analytics cookies.

The portfolio also includes a privacy policy explaining:

- analytics usage;
- contact form data;
- cookies;
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

- name length;
- valid email address;
- contact intent;
- message length.

A hidden honeypot field is also used to reject basic automated submissions.

Email delivery uses **React Email** for the message template.

Required environment configuration includes:

```env
CONTACT_TO_EMAIL=your@email.com
RESEND_API_KEY=your_resend_key
```

Environment files are excluded from version control.

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

- Node.js 20.9+
- pnpm

Clone the repository:

```bash
git clone https://github.com/Gerardoprogramer/personal-site.git
cd personal-site
```

Install dependencies:

```bash
pnpm install
```

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
pnpm build
```

These checks validate:

- ESLint rules;
- TypeScript types;
- production compilation.

---

## Deployment

The portfolio is deployed with **Vercel** using the custom domain:

https://gerardomartinez.dev

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

- Portfolio: https://gerardomartinez.dev
- GitHub: https://github.com/Gerardoprogramer
