'use client';

import { FaGithub, FaLinkedinIn, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { socials } from "@/content/portfolio";
import { getProfile } from "@/content/profile";
import { useTranslation } from "@/lib/i18n/context";

export const FooterBrand = () => {
    const { t } = useTranslation();
    const profile = getProfile(t);

    return (
        <div>
            <div className="font-display text-sm font-semibold">
                {profile.name}
            </div>
            <div className="mt-1 font-mono-tech text-xs uppercase tracking-[0.08em] text-muted-foreground">
                {profile.role} · {profile.location}
            </div>
            <div className="mt-6 flex items-center gap-3">
                <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`GitHub · ${t.common.newTab}`}
                    className="inline-flex size-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent md:size-9"
                >
                    <FaGithub className="size-4" aria-hidden="true" />
                </a>
                <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`LinkedIn · ${t.common.newTab}`}
                    className="inline-flex size-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent md:size-9"
                >
                    <FaLinkedinIn className="size-4" aria-hidden="true" />
                </a>
                <a
                    href={socials.email}
                    aria-label={t.common.sendEmail}
                    className="inline-flex size-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent md:size-9"
                >
                    <FaEnvelope className="size-4" aria-hidden="true" />
                </a>
                <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`WhatsApp · ${t.common.newTab}`}
                    className="inline-flex size-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent md:size-9"
                >
                    <FaWhatsapp className="size-4" aria-hidden="true" />
                </a>
            </div>
        </div>
    )
}
