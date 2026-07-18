import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";

const dictionaries = { es, en };
const SITE_URL = "https://gerardomartinez.dev";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const lang = (headersList.get("x-language") as "es" | "en") || "es";
    const dict = dictionaries[lang].privacy;

    return {
        title: dict.title,
        description: dict.intro,
        alternates: {
            canonical: `${SITE_URL}/privacidad?lang=${lang}`,
            languages: {
                es: `${SITE_URL}/privacidad?lang=es`,
                en: `${SITE_URL}/privacidad?lang=en`,
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function PrivacyPage() {
    const headersList = await headers();
    const lang = (headersList.get("x-language") as "es" | "en") || "es";
    const t = dictionaries[lang].privacy;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <Link
                href="/"
                className="font-mono-tech text-xs text-primary hover:underline mb-8 inline-block"
            >
                {lang === "es" ? "← volver al inicio" : "← back to home"}
            </Link>

            <h1 className="text-2xl sm:text-3xl font-display font-medium text-foreground mb-2">
                {t.title}
            </h1>
            <p className="font-mono-tech text-xs text-muted-foreground mb-10">
                {t.lastUpdated}
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed mb-10">
                {t.intro}
            </p>

            <div className="space-y-8">
                {t.sections.map((section) => (
                    <section key={section.heading}>
                        <h2 className="font-mono-tech text-sm text-primary mb-2">
              // {section.heading}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {section.body}
                        </p>
                    </section>
                ))}
            </div>

            <div className="mt-12 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                    {t.contact}{" "}
                    <a
                        href="mailto:hola@gerardomartinez.dev"
                        className="text-primary hover:underline"
                    >
                        hola@gerardomartinez.dev
                    </a>
                </p>
            </div>
        </div>
    );
}