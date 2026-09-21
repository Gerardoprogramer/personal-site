"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslation } from "@/lib/i18n/context";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "cookie-consent";

type ConsentValue = "granted" | "denied";

const CONSENT_EVENT = "portfolio-consent-change";
let memoryConsent: ConsentValue | null = null;

function getConsent(): ConsentValue | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return memoryConsent;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function serverConsent() {
  return undefined;
}

function applyConsent(value: ConsentValue) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: value,
    });
  }
}

export function CookieConsent() {
  const { t, language } = useTranslation();
  const consent = useSyncExternalStore(subscribe, getConsent, serverConsent);

  useEffect(() => {
    if (consent) applyConsent(consent);
  }, [consent]);

  const handleChoice = (value: ConsentValue) => {
    memoryConsent = value;
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* Use memory when storage is unavailable. */
    }
    applyConsent(value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (consent !== null) return null;

  return (
    <div
      className="cookie-banner fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl surface-card p-4 sm:p-5 shadow-2xl"
      role="dialog"
      aria-label={t.cookies.message}
    >
      <p className="font-mono-tech text-xs text-primary mb-2 tracking-wide uppercase">
        cookies
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {t.cookies.message}{" "}
        <a
          href={`/privacidad?lang=${language}`}
          className="text-accent hover:underline"
        >
          {t.cookies.linkText}
        </a>
        .
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => handleChoice("denied")}
          className="min-h-11 text-sm px-3.5 py-1.5 rounded-md border border-border text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors font-mono-tech"
        >
          {t.cookies.reject}
        </button>
        <button
          onClick={() => handleChoice("granted")}
          className="min-h-11 text-sm px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-mono-tech shadow-(--shadow-glow)"
        >
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}
