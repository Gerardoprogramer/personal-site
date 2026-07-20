'use client'

import { useLocalTime } from "@/hooks/useLocalTime";

export const LocalClock = () => {
    const time = useLocalTime({ timeZone: "America/Costa_Rica", locale: "es-CR" });
    const [hh, mm] = (time || "--:--").split(":");

    return (
        <div
            className="hidden items-center gap-1 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground md:flex tabular-nums"
            aria-label="Hora local en Costa Rica"
            title="Hora local · Costa Rica (UTC−6)"
        >
            <span className="text-primary/70">CR</span>
            <span suppressHydrationWarning className="flex items-center">
                {hh}
                <span className="mx-px animate-[pulse-dot_1.6s_step-end_infinite] text-primary/60">:</span>
                {mm}
            </span>
        </div>
    )
}
