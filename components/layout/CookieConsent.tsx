"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

const CONSENT_KEY = "cookie-consent";

type ConsentValue = "granted" | "denied";

function applyConsent(value: ConsentValue) {
    if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
            analytics_storage: value,
        });
    }
}

export function CookieConsent() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
        if (stored === "granted" || stored === "denied") {
            applyConsent(stored);
        } else {
            setVisible(true);
        }
    }, []);

    const handleChoice = (value: ConsentValue) => {
        localStorage.setItem(CONSENT_KEY, value);
        applyConsent(value);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl surface-card p-4 sm:p-5 shadow-[0_0_40px_-8px_oklch(0_0_0/0.5)] animate-[map-fade-in_0.3s_ease-out]"
            role="dialog"
            aria-label={t.cookies.message}
        >
            <p className="font-mono-tech text-xs text-primary mb-2 tracking-wide">
        // cookies
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t.cookies.message}{" "}
                <a
                    href="/privacidad"
                    className="text-primary hover:underline"
                >
                    {t.cookies.linkText}
                </a>
                .
            </p>
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => handleChoice("denied")}
                    className="text-sm px-3.5 py-1.5 rounded-md border border-border text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors font-mono-tech"
                >
                    {t.cookies.reject}
                </button>
                <button
                    onClick={() => handleChoice("granted")}
                    className="text-sm px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-mono-tech shadow-(--shadow-glow)"
                >
                    {t.cookies.accept}
                </button>
            </div>
        </div >
    );
}