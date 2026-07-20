'use client';

import { useLocalTime } from "@/hooks/useLocalTime";
import { useTranslation } from "@/lib/i18n/context";

export const HeroMeta = () => {
    const time = useLocalTime({ timeZone: "America/Costa_Rica", locale: "es-CR" });
    const { t } = useTranslation();

    return (
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono-tech text-[11px] uppercase tracking-widest text-primary">
            <span className="inline-flex items-center gap-2">
                <svg width="32" height="6" viewBox="0 0 32 6" aria-hidden="true">
                    <line x1="0" y1="3" x2="32" y2="3" stroke="var(--color-primary)" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-primary)" strokeWidth="1" />
                    <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" stroke="var(--color-primary)" strokeWidth="1" />
                    <line x1="21" y1="1.5" x2="21" y2="4.5" stroke="var(--color-primary)" strokeWidth="1" />
                    <line x1="32" y1="0" x2="32" y2="6" stroke="var(--color-primary)" strokeWidth="1" />
                </svg>
                {t.hero.meta.career} · liberia, cr
            </span>
            <span className="h-3 w-px bg-primary/40" aria-hidden="true" />
            <span
                className="inline-flex items-center gap-1.5 text-muted-foreground"
                title="Hora local · Costa Rica (UTC−6)"
                aria-label="Hora local en Costa Rica"
            >
                <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-primary"
                    style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                <span suppressHydrationWarning>{time || "--:--"}</span>
                <span className="text-primary/60">{t.hero.meta.hour}</span>
            </span>
        </div>
    )
}