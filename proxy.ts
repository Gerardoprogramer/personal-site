import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["es", "en"] as const;
type Lang = (typeof SUPPORTED)[number];
const DEFAULT_LANG: Lang = "es";

function isSupported(value: string | undefined): value is Lang {
    return !!value && (SUPPORTED as readonly string[]).includes(value);
}

export function proxy(request: NextRequest) {
    const langParam = request.nextUrl.searchParams.get("lang") ?? undefined;
    const cookieLang = request.cookies.get("language")?.value;


    const resolved: Lang =
        (isSupported(langParam) && langParam) ||
        (isSupported(cookieLang) && cookieLang) ||
        DEFAULT_LANG;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-language", resolved);

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    if (isSupported(langParam) && langParam !== cookieLang) {
        response.cookies.set("language", langParam, { path: "/", maxAge: 31536000 });
    }

    return response;
}

export const config = {
    matcher: "/((?!_next|api|.*\\..*).*)",
};