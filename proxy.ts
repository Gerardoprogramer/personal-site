import { NextRequest, NextResponse } from "next/server";
import { LANGUAGE_COOKIE, legacyRedirect } from "@/lib/redirects";
import { isLanguage } from "@/lib/routes";
import { toLanguage } from "@/lib/i18n/lang";

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const langParam = request.nextUrl.searchParams.get("lang");
    const cookieLang = request.cookies.get(LANGUAGE_COOKIE)?.value;

    const redirect = legacyRedirect({
        pathname,
        search,
        cookie: cookieLang,
        acceptLanguage: request.headers.get("accept-language"),
    });

    if (redirect) {
        // Stage 2: temporary (307), so browsers keep no redirect and a revert
        // takes effect at once.
        const response = NextResponse.redirect(
            new URL(redirect.location, request.url),
            307,
        );
        // No CDN may reuse one visitor's redirect for another.
        response.headers.set("Cache-Control", "private, no-store");
        if (redirect.negotiated) {
            response.headers.set("Vary", "Cookie, Accept-Language");
        } else if (redirect.lang !== cookieLang) {
            // An explicit ?lang= still stores the choice, as in stage 1, so
            // the next visit to / goes to the same language.
            response.cookies.set(LANGUAGE_COOKIE, redirect.lang, {
                path: "/",
                maxAge: 31536000,
            });
        }
        return response;
    }

    // Old paths that do not redirect (/proyectos/<unknown slug>) still render
    // the 404 of app/(legacy), in the language of ?lang= or the cookie.
    const resolved = toLanguage(
        isLanguage(langParam) ? langParam : cookieLang,
    );
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-language", resolved);

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    if (isLanguage(langParam) && langParam !== cookieLang) {
        response.cookies.set(LANGUAGE_COOKIE, langParam, { path: "/", maxAge: 31536000 });
    }

    return response;
}

// Only the old pages. /es and /en take the language from the path and are
// prerendered: the proxy never runs on them, so they get no Set-Cookie, no
// per-request header and no redirect loop.
export const config = {
    matcher: ["/", "/proyectos/:path*", "/privacidad"],
};
