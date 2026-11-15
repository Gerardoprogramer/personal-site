"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslation } from "@/lib/i18n/context";
import {
  CONSENT_KEY,
  analyticsCommands,
  analyticsScriptSrc,
  parseConsent,
  shouldLoadAnalytics,
  type ConsentValue,
} from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const CONSENT_EVENT = "portfolio-consent-change";
let memoryConsent: ConsentValue | null = null;
let analyticsLoaded = false;

function getConsent(): ConsentValue | null {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY));
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

// Adds Google Analytics to the page, once. Until this runs the page makes no
// request to Google: gtag.js is not in the HTML.
function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  const dataLayer = (window.dataLayer = window.dataLayer ?? []);
  window.gtag = function gtag() {
    // gtag.js reads each queued command as an `arguments` object, not an array.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  for (const command of analyticsCommands(new Date())) window.gtag(...command);
  const script = document.createElement("script");
  script.async = true;
  script.src = analyticsScriptSrc();
  document.head.appendChild(script);
}

// Accepted (now or on an earlier visit): load Analytics. Rejected in another
// tab after it was loaded here: withdraw the consent it was given.
function applyConsent(value: ConsentValue) {
  if (shouldLoadAnalytics(value)) {
    loadAnalytics();
  } else if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

export function CookieConsent() {
  const { t, href } = useTranslation();
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
      role="region"
      aria-labelledby="cookie-banner-title"
    >
      <p
        id="cookie-banner-title"
        className="font-mono-tech text-xs text-primary mb-2 tracking-wide uppercase"
      >
        cookies
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {t.cookies.message}{" "}
        <a
          href={href({ page: "privacy" })}
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
