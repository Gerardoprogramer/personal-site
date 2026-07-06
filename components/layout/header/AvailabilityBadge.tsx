'use client';

import { useTranslation } from "@/lib/i18n/context"

export const AvailabilityBadge = () => {
    const { t } = useTranslation();

    return (
        <div className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 md:flex">
            <span
                className="size-1.5 rounded-full bg-primary"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            <span className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                {t.nav.disponible}
            </span>
        </div>
    )
}
