import type { Language } from "./i18n/lang";
import { LANGUAGE_COOKIE } from "./redirects";

// One year, in seconds.
export const LANGUAGE_COOKIE_MAX_AGE = 31536000;

// Attributes of the language cookie, shared by the proxy (Set-Cookie) and the
// language switcher (document.cookie). `protocol` is the page's, with the
// colon ("https:"): Secure is set only over HTTPS, so the cookie still works
// on http://localhost.
export function languageCookieAttributes(protocol: string) {
  return {
    path: "/",
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: protocol === "https:",
  };
}

// The same cookie as a document.cookie assignment.
export function languageCookieString(lang: Language, protocol: string) {
  const { path, maxAge, secure } = languageCookieAttributes(protocol);
  return `${LANGUAGE_COOKIE}=${lang}; path=${path}; max-age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
}
