import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { LanguageProvider } from "@/lib/i18n/context";
import { CookieConsent } from "@/components/layout/CookieConsent";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";
import { toLanguage } from "@/lib/i18n/lang";
import { SITE_URL } from "@/content/profile";
import { personJsonLd, serializeJsonLd } from "@/lib/structured-data";
import {
  defaultOgImage,
  defaultOgImageAlt,
  languageAlternates,
  localizedUrl,
  ogLocale,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

const GA_MEASUREMENT_ID = "G-EYVSL76CFW";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const initialLang = toLanguage(headersList.get("x-language"));
  const jsonLd = personJsonLd(initialLang);

  return (
    <html
      lang={initialLang}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(jsonLd),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider initialLang={initialLang}>
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-60 rounded bg-foreground px-5 py-3 text-background focus:not-sr-only focus:fixed"
          >
            {dictionaries[initialLang].common.skipToContent}
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
