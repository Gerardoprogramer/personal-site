'use client';

import { FaWhatsapp, FaDownload, FaArrowRight, FaArrowDown } from "react-icons/fa";
import { socials } from "@/content/portfolio";
import { useTranslation } from "@/lib/i18n/context";

export const HeroActions = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 sm:items-stretch">
            <a
                href="#contacto"
                className="group inline-flex min-h-12 items-center justify-center gap-2 py-3 rounded-md bg-primary px-6 font-mono-tech text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                style={{ boxShadow: "var(--shadow-glow)" }}
            >
                {t.hero.actions.contacto}
                <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                >
                    <FaArrowRight className="size-3" strokeWidth={1.5} aria-hidden="true" />
                </span>
            </a>
            <a
                href="#experiencia"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 font-mono-tech text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-surface-2"
            >
                {t.hero.actions.perfil}
                <span
                    aria-hidden="true"
                    className="text-muted-foreground transition-colors group-hover:text-primary"
                >
                    <FaArrowDown className="size-3" strokeWidth={1.5} aria-hidden="true" />
                </span>
            </a>
            <a
                href={socials.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 font-mono-tech text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-surface-2"
            >
                <FaWhatsapp className="size-4" strokeWidth={1.5} aria-hidden="true" />
                whatsapp
            </a>
            <a
                href={socials.cv}
                download
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-dashed border-border/80 px-5 font-mono-tech text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
                <FaDownload className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                {t.hero.actions.descargar} cv
                <span className="text-[10px] opacity-60" aria-hidden="true">.pdf</span>
            </a>
        </div>
    )
}
