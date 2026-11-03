import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { toLanguage } from "@/lib/i18n/lang";

const copy = {
  es: {
    title: "Página no encontrada",
    description: "La página que buscas no existe o cambió de dirección.",
    heading: "Esta página no existe.",
    body: "Puede que el enlace esté mal escrito o que la página haya cambiado de dirección.",
    home: "Volver al inicio",
    projects: "Ver proyectos",
  },
  en: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has moved.",
    heading: "This page does not exist.",
    body: "The link may be mistyped, or the page may have moved.",
    home: "Back to home",
    projects: "View projects",
  },
};

async function getLanguage() {
  return toLanguage((await headers()).get("x-language"));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = copy[await getLanguage()];
  return {
    title: t.title,
    description: t.description,
    robots: { index: false, follow: true },
    alternates: null,
    openGraph: null,
    twitter: null,
  };
}

export default async function NotFound() {
  const lang = await getLanguage();
  const t = copy[lang];

  return (
    <section className="section-shell pb-24 pt-36 sm:pt-44">
      <p className="eyebrow mb-6">404</p>
      <h1 className="max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
        {t.heading}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        {t.body}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link href={`/?lang=${lang}`} className="button-primary">
          <FiArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          {t.home}
        </Link>
        <Link href={`/?lang=${lang}#proyectos`} className="button-text">
          {t.projects}
          <FiArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      </div>
    </section>
  );
}
