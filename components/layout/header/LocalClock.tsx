'use client'

import { useLocalTime } from "@/hooks/useLocalTime";

export const LocalClock = () => {

    const time = useLocalTime({ timeZone: "America/Costa_Rica", locale: "es-CR" });


    return (
        <div
            className="hidden items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground md:flex"
            aria-label="Hora local en Costa Rica"
            title="Hora local · Costa Rica (UTC−6)"
        >
            <span className="text-primary/70">CR</span>
            <span suppressHydrationWarning>{time || "--:--"}</span>
        </div>
    )
}
