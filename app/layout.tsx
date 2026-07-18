import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { LanguageProvider } from "@/lib/i18n/context";
import { CookieConsent } from "@/components/layout/CookieConsent";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://gerardomartinez.dev";

const dictionaries = { es, en };

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang = (headersList.get("x-language") as "es" | "en") || "es";
  const dict = dictionaries[lang].meta;
  const ogLocale = lang === "es" ? "es_CR" : "en_US";
  const canonicalUrl = `${SITE_URL}/?lang=${lang}`;

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
      locale: ogLocale,
      url: canonicalUrl,
      title: dict.title,
      description: dict.ogDescription,
      siteName: "Gerardo Martínez Monge",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Gerardo Martínez Monge - Full Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.title,
      description: dict.twitterDescription,
      images: ["/og-image.png"],
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
      languages: {
        es: `${SITE_URL}/?lang=es`,
        en: `${SITE_URL}/?lang=en`,
        "x-default": SITE_URL,
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}

function buildJsonLd(lang: "es" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Gerardo Martínez Monge",
    url: SITE_URL,
    jobTitle:
      lang === "es"
        ? "Informático Empresarial · Full Stack Developer"
        : "Full Stack Developer · Business Informatics Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Liberia",
      addressCountry: "CR",
    },
    email: "hola@gerardomartinez.dev",
    sameAs: [
      "https://github.com/Gerardoprogramer",
      "https://www.linkedin.com/in/gerardomartinezmonge",
    ],
    knowsAbout: [
      "Python",
      "FastAPI",
      "Django",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "PostgreSQL",
      "Domain-Driven Design",
      "Hexagonal Architecture",
    ],
  };
}

const GA_MEASUREMENT_ID = "G-ZN99W31GTF";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const initialLang = (headersList.get("x-language") as "es" | "en") || "es";
  const jsonLd = buildJsonLd(initialLang);

  return (
    <html
      lang={initialLang}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              analytics_storage: 'denied'
            });
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider initialLang={initialLang}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}