"use client";

import { useTranslation } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t.nav.languageSwitcher}
      className="flex rounded-full border border-border p-0.5 font-mono-tech text-xs"
    >
      {(["es", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`min-h-10 min-w-10 rounded-full transition-colors ${language === lang ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
