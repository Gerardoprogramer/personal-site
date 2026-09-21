"use client";

import { experience } from "@/content/Experience";
import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function Experience() {
  const { t, language } = useTranslation();
  const es = language === "es";
  return (
    <section
      id="experiencia"
      className="relative isolate border-y border-border bg-surface/60 py-20"
    >
      <BackgroundLetter letter="R" />
      <div className="section-shell">
        <p className="eyebrow mb-4">02 / {es ? "Experiencia" : "Experience"}</p>
        <h2 className="mb-10 font-display text-4xl tracking-tight sm:text-5xl">
          {es ? "También, construir en equipo." : "Building with a team, too."}
        </h2>
        {experience(t).map((exp) => (
          <article
            key={exp.company}
            className="grid gap-5 border-t border-border py-8 md:grid-cols-[1fr_2fr] md:gap-14"
          >
            <div>
              <p className="font-mono-tech text-xs text-accent">
                {exp.period} / {exp.format}
              </p>
              <h3 className="mt-3 font-display text-3xl">{exp.company}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {exp.role}
              </p>
            </div>
            <div>
              <p className="text-base leading-relaxed">{exp.built[0]}</p>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer py-2 text-muted-foreground hover:text-foreground">
                  {es
                    ? "Más sobre mi contribución"
                    : "More about my contribution"}
                </summary>
                <ul className="mt-3 space-y-3 text-muted-foreground">
                  {exp.built.slice(1).map((item) => (
                    <li key={item} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
