'use client';

import { useTranslation } from "@/lib/i18n/context"

export const LanguageSwitcher = () => {
    const { setLanguage, language, t } = useTranslation();

    return (
        <div
            role="group"
            aria-label={t.nav.languageSwitcher}
            className="relative items-stretch border border-border font-mono-tech text-[10px] uppercase tracking-widest sm:flex"
        >
            <span
                className="absolute inset-y-0 w-1/2 bg-primary/10 border-r border-primary/30 transition-transform duration-200 ease-out"
                style={{ transform: language === "en" ? "translateX(100%)" : "translateX(0%)" }}
                aria-hidden="true"
            />
            <button
                type="button"
                onClick={() => setLanguage("es")}
                aria-pressed={language === "es"}
                className={`relative z-10 px-2.5 py-1 transition-colors ${language === "es" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
                ES
            </button>
            <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`relative z-10 px-2.5 py-1 transition-colors ${language === "en" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
                EN
            </button>
        </div>
    );
};