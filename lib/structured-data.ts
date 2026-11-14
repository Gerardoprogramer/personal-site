import { SITE_URL, profileStatic } from "@/content/profile";
import { socials } from "@/content/portfolio";
import { CORE_STACK } from "@/content/stack";
import {
  projectDemo,
  type Project,
  type ProjectSlug,
} from "@/content/projects";
import { projectsContent } from "@/lib/i18n/projects.content";
import type { Language } from "@/lib/i18n/lang";
import { jobTitle } from "@/lib/seo";

// schema.org data for the site. Every value is also visible on the page that
// carries it, so each page gets only the Person fields it shows.

export const PERSON_ID = `${SITE_URL}/#person`;

// Fields the header and footer show on every page: name, location, email and
// the GitHub and LinkedIn profiles.
export function personBaseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: profileStatic.name,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Liberia",
      addressCountry: "CR",
    },
    email: profileStatic.email,
    sameAs: [socials.github, socials.linkedin],
  };
}

// Home page only: it also shows the role in the experience section and the
// core stack in the stack section.
export function personJsonLd(lang: Language) {
  return {
    ...personBaseJsonLd(),
    jobTitle: jobTitle(lang),
    knowsAbout: [...CORE_STACK],
  };
}

// Escapes "<" so the JSON cannot close the surrounding <script> tag.
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// How each case study is described in schema.org. Selvática is a website, not
// an application, so it is a CreativeWork. inLanguage is set only where the
// page states the product's languages (Libra: "in Spanish and English").
const projectSchema: Record<
  ProjectSlug,
  | { type: "SoftwareApplication"; category: string; inLanguage?: Language[] }
  | { type: "CreativeWork" }
> = {
  libra: {
    type: "SoftwareApplication",
    category: "ReferenceApplication",
    inLanguage: ["es", "en"],
  },
  "la-central": { type: "SoftwareApplication", category: "BusinessApplication" },
  "obsidian-library": {
    type: "SoftwareApplication",
    category: "BusinessApplication",
  },
  selvatica: { type: "CreativeWork" },
};

// Name and description come from the case study header (project name and
// introduction). The demo and repositories are added only when the page links
// to them.
export function projectJsonLd(project: Project, lang: Language) {
  const schema = projectSchema[project.slug];
  const demo = projectDemo(project, lang);
  return {
    "@context": "https://schema.org",
    "@type": schema.type,
    name: project.name,
    description: projectsContent[lang][project.slug].introduction,
    author: { "@type": "Person", "@id": PERSON_ID, name: profileStatic.name },
    ...(schema.type === "SoftwareApplication" && {
      applicationCategory: schema.category,
      ...(schema.inLanguage && { inLanguage: schema.inLanguage }),
    }),
    ...(demo && { url: demo }),
    ...(project.repositories.length > 0 && {
      isBasedOn: project.repositories.map((repo) => ({
        "@type": "SoftwareSourceCode",
        codeRepository: repo.href,
      })),
    }),
  };
}
