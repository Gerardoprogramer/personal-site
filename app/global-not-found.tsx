import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { notFoundCopy } from "@/lib/i18n/not-found";
import { pathFor } from "@/lib/routes";

// 404 for URLs that match no route at all (e.g. /foo/bar). With two root
// layouts, (legacy) and [lang], there is no single layout to render it in, so
// Next renders this file as a full document. It cannot know the visitor's
// language, so it shows both. Requires experimental.globalNotFound, which is
// experimental in Next.js 16.4.5.
export const metadata: Metadata = {
  title: "404 | Gerardo Martínez Monge",
  description: `${notFoundCopy.es.description} / ${notFoundCopy.en.description}`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="es"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <main id="main-content" className="flex-1">
          <section className="section-shell pb-24 pt-36 sm:pt-44">
            <p className="eyebrow mb-6">404</p>
            {(["es", "en"] as const).map((lang) => (
              <div key={lang} lang={lang} className="mb-12">
                <h1 className="max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
                  {notFoundCopy[lang].heading}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {notFoundCopy[lang].body}
                </p>
                <div className="mt-8">
                  {/* Plain anchors: this page is outside both root layouts. */}
                  <a href={pathFor({ page: "home" }, lang)} className="button-primary">
                    {notFoundCopy[lang].home}
                  </a>
                </div>
              </div>
            ))}
          </section>
        </main>
      </body>
    </html>
  );
}
