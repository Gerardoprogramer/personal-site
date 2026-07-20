'use client';

import { FaWhatsapp, FaDownload, FaArrowRight, FaArrowDown } from "react-icons/fa";
import { socials } from "@/content/portfolio";
import { useTranslation } from "@/lib/i18n/context";

export const HeroActions = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                    href="#contacto"
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-mono-tech text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
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
            </div>

            <div className="mt-3 flex items-center gap-2">
                <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 font-mono-tech text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                    <FaWhatsapp className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    whatsapp
                </a>
                <span className="h-3 w-px bg-border" aria-hidden="true" />
                <a
                    href={socials.cv}
                    download
                    className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 font-mono-tech text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                    <FaDownload className="size-3" strokeWidth={1.5} aria-hidden="true" />
                    {t.hero.actions.descargar} cv
                    <span className="text-[10px] opacity-60" aria-hidden="true">.pdf</span>
                </a>
            </div>
        </div>
    )
}