import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { SiteShell } from "@/components/layout/SiteShell";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";
import type { Language } from "@/lib/i18n/lang";
import { SITE_URL } from "@/content/profile";
import { LANGUAGES, isLanguage } from "@/lib/routes";
import {
  defaultOgImage,
  defaultOgImageAlt,
  languageAlternates,
  localizedUrl,
  ogLocale,
  otherLanguage,
} from "@/lib/seo";

const dictionaries = { es, en };

type Props = { params: Promise<{ lang: string }> };

// Only /es and /en exist; any other first segment is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

async function getLanguage(params: Props["params"]): Promise<Language> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return lang;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await getLanguage(params);
  const dict = dictionaries[lang].meta;
  const canonicalUrl = localizedUrl({ page: "home" }, lang);
  const ogImage = defaultOgImage(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.title,
      template: "%s | Gerardo Martínez Monge",
    },
    description: dict.description,
    keywords: dict.keywords,
    authors: [{ name: "Gerardo Martínez Monge", url: SITE_URL }],
    creator: "Gerardo Martínez Monge",
    openGraph: {
      type: "website",
      locale: ogLocale(lang),
      alternateLocale: ogLocale(otherLanguage(lang)),
      url: canonicalUrl,
      title: dict.title,
      description: dict.ogDescription,
      siteName: "Gerardo Martínez Monge",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: defaultOgImageAlt(lang),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.title,
      description: dict.twitterDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates({ page: "home" }),
    },
    icons: {
      icon: {
        url: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      apple: {
        url: "/apple-icon.png?v=gm-1",
        sizes: "180x180",
        type: "image/png",
      },
    },
  };
}

// Root layout of /es and /en. The language comes from the URL segment, never
// from headers or the query string, so every page under it is prerendered.
export default async function LangLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & Props>) {
  const lang = await getLanguage(params);

  return (
    <SiteShell
      lang={lang}
      provider={({ children }) => (
        <LanguageProvider lang={lang}>{children}</LanguageProvider>
      )}
    >
      {children}
    </SiteShell>
  );
}
