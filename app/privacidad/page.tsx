import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";
import { toLanguage } from "@/lib/i18n/lang";
import { profileStatic } from "@/content/profile";
import {
  defaultOgImage,
  languageAlternates,
  localizedUrl,
  ogLocale,
} from "@/lib/seo";

const dictionaries = { es, en };

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang = toLanguage(headersList.get("x-language"));
  const dict = dictionaries[lang].privacy;
  const canonicalUrl = localizedUrl("/privacidad", lang);
  const ogImage = defaultOgImage(lang);

  return {
    title: dict.title,
    description: dict.intro,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates("/privacidad"),
    },
    openGraph: {
      type: "website",
      locale: ogLocale(lang),
      url: canonicalUrl,
      title: `${dict.title} | Gerardo Martínez Monge`,
      description: dict.intro,
      siteName: "Gerardo Martínez Monge",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Gerardo Martínez Monge - Full Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.title} | Gerardo Martínez Monge`,
      description: dict.intro,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage() {
  const headersList = await headers();
  const lang = toLanguage(headersList.get("x-language"));
  const t = dictionaries[lang].privacy;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 pb-20 pt-32">
      <Link
        href={`/?lang=${lang}`}
        className="font-mono-tech text-xs text-muted-foreground hover:text-accent transition-colors mb-8 inline-flex items-center gap-2"
      >
        <FiArrowLeft aria-hidden="true" className="size-4 shrink-0" />
        {dictionaries[lang].common.backHome}
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
            <h2 className="font-mono-tech text-sm text-accent mb-2">
              {section.heading}
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
            href={`mailto:${profileStatic.email}`}
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            {profileStatic.email}
          </a>
        </p>
      </div>
    </div>
  );
}
