"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { caseLabels, projectsContent } from "@/lib/i18n/projects.content";
import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function Projects() {
  const { language } = useTranslation();
  const es = language === "es";
  const labels = caseLabels[language];
  return (
    <section id="proyectos" className="section-shell relative isolate pb-24">
      <BackgroundLetter letter="E" side="left" position="top" />
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-t border-border pt-8">
        <div>
          <p className="eyebrow mb-3">01 / {labels.selected}</p>
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            {es
              ? "Tres proyectos. Tres enfoques."
              : "Three projects. Three perspectives."}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {es
            ? "Producto, operación y experiencia visual. Una selección para ver cómo diseño y construyo."
            : "Product, operations and visual experience. A selection of how I design and build."}
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, index) => {
          const copy = projectsContent[language][project.slug];
          return (
            <Link
              key={project.slug}
              href={`/proyectos/${project.slug}?lang=${language}`}
              className={`group block min-w-0 ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl border border-white/10 p-4 pb-0 sm:p-7 sm:pb-0 ${index === 0 ? "md:px-16 md:pt-10" : ""}`}
                style={{ backgroundColor: project.surface }}
              >
                <div
                  className="mb-4 flex items-center justify-between gap-3 font-mono-tech text-[11px]"
                  style={{ color: project.color }}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")} / {project.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  >
                    ↗
                  </span>
                </div>
                <div
                  className={`overflow-hidden rounded-t-lg border border-white/10 bg-background shadow-2xl transition-transform duration-500 group-hover:-translate-y-1 ${index === 0 ? "aspect-[2/1] md:aspect-[2.65/1]" : "aspect-[1.5/1]"}`}
                >
                  <Image
                    src={project.image}
                    alt={copy.coverAlt}
                    width={project.imageWidth}
                    height={project.imageHeight}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes={
                      index === 0
                        ? "(max-width: 768px) 90vw, 1000px"
                        : "(max-width: 768px) 90vw, 540px"
                    }
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div
                className={`py-6 ${index === 0 ? "md:grid md:grid-cols-2 md:gap-10" : ""}`}
              >
                <div>
                  <p className="eyebrow mb-2 text-muted-foreground">
                    {copy.category}
                  </p>
                  <h3 className="font-display text-3xl tracking-tight sm:text-4xl">
                    {project.name}
                  </h3>
                </div>
                <div>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    {copy.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <span className="text-muted-foreground">
                      {project.stack.slice(0, 4).join(" · ")}
                    </span>
                    <span
                      className="inline-flex min-h-8 items-center gap-2"
                      style={{ color: project.color }}
                    >
                      {labels.view} <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
