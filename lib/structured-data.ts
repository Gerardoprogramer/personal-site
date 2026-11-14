import { SITE_URL, profileStatic } from "@/content/profile";
import { socials } from "@/content/portfolio";
import { CORE_STACK } from "@/content/stack";
import type { Language } from "@/lib/i18n/lang";
import { jobTitle } from "@/lib/seo";

// schema.org data for the site. Every value here is also visible on the page
// that carries it: the role and location in the hero, the email in the
// contact section and footer, the profiles in the header, and the core stack
// in the stack section.

export const PERSON_ID = `${SITE_URL}/#person`;

export function personJsonLd(lang: Language) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: profileStatic.name,
    url: SITE_URL,
    jobTitle: jobTitle(lang),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Liberia",
      addressCountry: "CR",
    },
    email: profileStatic.email,
    sameAs: [socials.github, socials.linkedin],
    knowsAbout: [...CORE_STACK],
  };
}

// Escapes "<" so the JSON cannot close the surrounding <script> tag.
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
