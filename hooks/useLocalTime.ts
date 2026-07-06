import { useEffect, useRef, useState } from "react";

interface UseLocalTimeOptions {
    timeZone: string;
    locale?: string;
    hour12?: boolean;
}

export function useLocalTime({ timeZone, locale = "en-US", hour12 = false }: UseLocalTimeOptions) {
    const [time, setTime] = useState<string>("");
    const formatterRef = useRef(
        new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12,
            timeZone,
        })
    );

    useEffect(() => {
        let timeoutId: number;

        const tick = () => {
            setTime(formatterRef.current.format(new Date()));
            const now = new Date();
            const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
            timeoutId = window.setTimeout(tick, msToNextMinute);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                window.clearTimeout(timeoutId);
                tick();
            }
        };

        tick();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.clearTimeout(timeoutId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [timeZone, locale, hour12]);

    return time;
}