import type { Metadata } from "next";
import "../globals.css";
import { headers } from "next/headers";
import { LanguageProvider } from "@/lib/i18n/context";
import { SiteShell } from "@/components/layout/SiteShell";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";
import { toLanguage } from "@/lib/i18n/lang";
import { SITE_URL } from "@/content/profile";
import {
  defaultOgImage,
  defaultOgImageAlt,
  languageAlternates,
  localizedUrl,
  ogLocale,
} from "@/lib/seo";

const dictionaries = { es, en };

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang = toLanguage(headersList.get("x-language"));
  const dict = dictionaries[lang].meta;
  const canonicalUrl = localizedUrl("/", lang);
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
      languages: languageAlternates("/"),
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

// Root layout of the routes that still read the language from ?lang= or the
// cookie (via the proxy's x-language header). Temporary: removed in stage 3 of
// the route migration, once these URLs redirect to /es and /en.
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const initialLang = toLanguage(headersList.get("x-language"));

  return (
    <SiteShell
      lang={initialLang}
      provider={({ children }) => (
        <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
      )}
    >
      {children}
    </SiteShell>
  );
}
