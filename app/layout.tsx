import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { LanguageProvider } from "@/lib/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://gerardomm.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gerardo Martínez Monge | Ingeniero en Sistemas · Full Stack Developer",
    template: "%s | Gerardo Martínez Monge",
  },
  description:
    "Ingeniero en Sistemas Full Stack en Costa Rica. Construyo ERPs con arquitectura hexagonal y DDD, sistemas backend con Python/FastAPI/Django, y frontend con React/Next.js. Disponible para empleo fijo y proyectos freelance.",
  keywords: [
    "Gerardo Martínez Monge",
    "Full Stack Developer Costa Rica",
    "Ingeniero en Sistemas",
    "Python developer",
    "FastAPI",
    "Django developer",
    "React developer",
    "Next.js developer",
    "Domain-Driven Design",
    "Arquitectura Hexagonal",
    "Desarrollador freelance Costa Rica",
  ],
  authors: [{ name: "Gerardo Martínez Monge", url: SITE_URL }],
  creator: "Gerardo Martínez Monge",
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: SITE_URL,
    title: "Gerardo Martínez Monge | Full Stack Developer",
    description:
      "Diseño y construyo software que resiste producción. ERPs, sistemas backend y frontend con arquitectura sólida.",
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
    title: "Gerardo Martínez Monge | Full Stack Developer",
    description:
      "Diseño y construyo software que resiste producción.",
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
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gerardo Martínez Monge",
  url: SITE_URL,
  jobTitle: "Ingeniero en Sistemas · Full Stack Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Liberia",
    addressCountry: "CR",
  },
  email: "hola@gerardomartinez.dev",
  sameAs: [
    "https://github.com/tu-usuario",
    "https://linkedin.com/in/tu-usuario",
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
    "Arquitectura Hexagonal",
  ],
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  const headersList = await headers();
  const initialLang = (headersList.get("x-language") as "es" | "en") || "es";

  return (
    <html
      lang={initialLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider initialLang={initialLang}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}