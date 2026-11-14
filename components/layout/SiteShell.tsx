import type { ReactNode } from "react";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { fontVariables } from "@/lib/fonts";
import type { Language } from "@/lib/i18n/lang";
import es from "@/lib/i18n/es.json";
import en from "@/lib/i18n/en.json";

const dictionaries = { es, en };

const GA_MEASUREMENT_ID = "G-EYVSL76CFW";

// The <html> document shared by every root layout: fonts, Google Analytics
// (denied until the visitor accepts cookies), header, footer and the cookie
// banner. Each layout passes its own language provider.
export function SiteShell({
  lang,
  provider: Provider,
  children,
}: {
  lang: Language;
  provider: (props: { children: ReactNode }) => ReactNode;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
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
        <Provider>
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-60 rounded bg-foreground px-5 py-3 text-background focus:not-sr-only focus:fixed"
          >
            {dictionaries[lang].common.skipToContent}
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </Provider>
      </body>
    </html>
  );
}
