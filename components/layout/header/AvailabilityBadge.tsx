'use client';

import { useTranslation } from "@/lib/i18n/context"

export const AvailabilityBadge = () => {
    const { t } = useTranslation();

    return (
        <div className="hidden items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-widest text-primary md:flex">
            <span className="text-muted-foreground/50">[</span>
            <span
                className="size-1.5 rounded-full bg-primary shrink-0"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            {t.nav.disponible}
            <span className="text-muted-foreground/50">]</span>
        </div>
    )
}