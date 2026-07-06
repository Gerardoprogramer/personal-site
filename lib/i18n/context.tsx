"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";

export type Language = "es" | "en";
export type Translations = typeof es;
const translations: Record<Language, Translations> = { es, en };

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
    children,
    initialLang,
}: {
    children: ReactNode;
    initialLang: Language;
}) {
    const [language, setLanguageState] = useState<Language>(initialLang);

    const setLanguage = (lang: Language) => {
        document.cookie = `language=${lang}; path=/; max-age=31536000`;
        setLanguageState(lang);
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage, t: translations[language] }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useTranslation debe usarse dentro de LanguageProvider");
    return ctx;
}