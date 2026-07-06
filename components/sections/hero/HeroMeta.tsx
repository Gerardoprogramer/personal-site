'use client';

import { useLocalTime } from "@/hooks/useLocalTime";
import { useTranslation } from "@/lib/i18n/context";

export const HeroMeta = () => {
    const time = useLocalTime({ timeZone: "America/Costa_Rica", locale: "es-CR" });
    const { t } = useTranslation();

    return (
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono-tech text-[11px] uppercase tracking-widest text-primary">
            <span className="inline-flex items-center gap-2">
                <span className="h-px w-8 bg-primary" />
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
