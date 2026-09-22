"use client";

import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function Hero() {
  const { language } = useTranslation();
  const es = language === "es";
  return (
    <section
      id="top"
      className="section-shell relative isolate pb-16 pt-36 sm:pb-20 sm:pt-44"
    >
      <BackgroundLetter letter="G" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-secondary/15 blur-[100px]"
      />
      <div className="relative">
        <p className="eyebrow mb-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground">
          <span className="text-foreground">Gerardo Martínez Monge</span>
          <span>Liberia, Costa Rica</span>
        </p>
        <h1 className="font-display text-[clamp(2.75rem,5.3vw,4.75rem)] leading-[1.06] tracking-[-0.045em]">
          {es ? "Del problema real" : "From a real problem"}
          <br />
          <span className="text-accent">
            {es
              ? "al software que lo resuelve."
              : "to software that solves it."}
          </span>
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {es
              ? "Soy desarrollador full stack e informático empresarial. Construyo aplicaciones completas, desde las reglas del negocio hasta los detalles de la interfaz."
              : "I’m a full stack developer with a background in Business Informatics. I build complete applications, from business rules to the details of the interface."}
          </p>
          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <a href="#proyectos" className="button-primary">
              {es ? "Ver proyectos" : "View projects"}{" "}
              <FiArrowDownRight
                aria-hidden="true"
                className="size-4 shrink-0"
              />
            </a>
            <a href="#contacto" className="button-text">
              {es ? "Hablemos" : "Get in touch"}{" "}
              <FiArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </div>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono-tech text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#91c6a4]" />
            {es
              ? "Disponible para empleo y proyectos"
              : "Open to roles and projects"}
          </span>
          <a
            href="/CV_Gerardo_Martinez_General.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 underline decoration-border underline-offset-4 hover:text-foreground"
          >
            {es ? "Ver currículum" : "View résumé"}
            <FiArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
