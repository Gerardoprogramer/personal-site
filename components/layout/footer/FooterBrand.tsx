'use client';

import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
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
            <div className="mt-1 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground">
                {profile.role} · {profile.location}
            </div>
            <div className="mt-6 flex items-center gap-3">
                <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="GitHub"
                    className="inline-flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                    <FaGithub className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="LinkedIn"
                    className="inline-flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                    <FaLinkedin className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a
                    href={socials.email}
                    aria-label="Enviar correo"
                    className="inline-flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                    <FaEnvelope className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="WhatsApp"
                    className="inline-flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                    <FaWhatsapp className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
            </div>
        </div>
    )
}
