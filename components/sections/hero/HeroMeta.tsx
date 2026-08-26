'use client';

import { useLocalTime } from "@/hooks/useLocalTime";
import { useTranslation } from "@/lib/i18n/context";

export const HeroMeta = () => {
    const time = useLocalTime({ timeZone: "America/Costa_Rica", locale: "es-CR" });
    const { t } = useTranslation();

    return (
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm tracking-wide text-foreground/70">
            <span className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent/70" aria-hidden="true" />
                {t.hero.meta.career} — liberia, cr
            </span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span
                className="inline-flex items-center gap-1.5"
                title="Hora local · Costa Rica (UTC−6)"
                aria-label="Hora local en Costa Rica"
            >
                <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-accent"
                    style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                <span suppressHydrationWarning>{time || "--:--"}</span>
                <span className="text-foreground/50">{t.hero.meta.hour}</span>
            </span>
        </div>
    )
}