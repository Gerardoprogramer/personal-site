"use client";

import { FiArrowDownRight, FiArrowUpRight, FiFileText } from "react-icons/fi";
import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";
import { cvHref } from "@/content/portfolio";

export function Hero() {
  const { t, language } = useTranslation();
  return (
    <section
      id="top"
      className="section-shell relative isolate pb-12 pt-36 sm:pt-40"
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
          {t.hero.titleLine1}
          <br />
          <span className="text-accent">
            {t.hero.titleLine2}
          </span>
        </h1>
        {/* Figures checked on 2026-11-14: live demos of Libra, Obsidian Library
            and Selvática; Libra CI run 43528652160 (684 + 23 unique tests). */}
        <p className="mt-6 font-mono-tech text-sm text-muted-foreground">
          {t.hero.proof}
        </p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t.hero.intro}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#proyectos" className="button-primary">
            {t.hero.viewProjects}{" "}
            <FiArrowDownRight aria-hidden="true" className="size-4 shrink-0" />
          </a>
          <a href="#contacto" className="button-text">
            {t.hero.talk}{" "}
            <FiArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </a>
          <a
            href={cvHref(language)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.hero.cvLabel}
            className="button-outline"
          >
            <FiFileText aria-hidden="true" className="size-4 shrink-0" />
            {t.common.viewResume}
          </a>
        </div>
        <p className="mt-5 flex items-center gap-2 font-mono-tech text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[#91c6a4]" />
          {t.hero.availability}
        </p>
      </div>
    </section>
  );
}
