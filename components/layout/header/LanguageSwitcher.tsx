'use client';

import { useTranslation } from "@/lib/i18n/context"

const buttonClass = (isActive: boolean) =>
    `px-2 py-1 transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

export const LanguageSwitcher = () => {
    const { setLanguage, language, t } = useTranslation();

    return (
        <div
            role="group"
            aria-label={t.nav.languageSwitcher}
            className="items-stretch border border-border font-mono-tech text-[10px] uppercase tracking-widest sm:flex"
        >
            <button
                type="button"
                onClick={() => setLanguage("es")}
                aria-pressed={language === "es"}
                className={buttonClass(language === "es")}
            >
                ES
            </button>
            <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={buttonClass(language === "en")}
            >
                EN
            </button>
        </div>
    );
};