'use client';

import { useTranslation } from "@/lib/i18n/context"

interface AvailabilityBadgeProps {
    compact?: boolean;
}

export const AvailabilityBadge = ({ compact = false }: AvailabilityBadgeProps) => {
    const { t } = useTranslation();

    return (
        <div
            className={
                compact
                    ? "flex items-center gap-1.5"
                    : "flex items-center gap-1.5 text-[11px] tracking-wide text-accent"
            }
        >
            <span
                className="size-1.5 shrink-0 rounded-full bg-accent"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            {!compact && t.nav.disponible}
        </div>
    )
}