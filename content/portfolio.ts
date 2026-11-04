import { profileStatic } from "./profile";
import type { Language } from "@/lib/i18n/lang";

interface propsSocials {
    github: string,
    linkedin: string,
    email: string,
    whatsapp: string
}

export const socials: propsSocials = {
    github: "https://github.com/Gerardoprogramer",
    linkedin: "https://www.linkedin.com/in/gerardo-martinez-dev",
    email: `mailto:${profileStatic.email}`,
    whatsapp: "https://wa.me/50689462689",
};

// CV files in public/CV, one per site language. Names keep their spaces and
// accents, so the public URL is percent-encoded.
export const cvFiles: Record<Language, string> = {
    es: "Gerardo Martínez Monge ES.pdf",
    en: "Gerardo Martínez Monge EN.pdf",
};

export function cvHref(language: Language) {
    return `/CV/${encodeURIComponent(cvFiles[language])}`;
}