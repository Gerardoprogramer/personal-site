"use client";

import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { projectsContent, caseLabels } from "@/lib/i18n/projects.content";
import { useTranslation } from "@/lib/i18n/context";
import { ProjectImage } from "./ProjectImage";
import { ProjectFeature } from "./ProjectFeature";

export function ProjectCaseStudy({ project }: { project: Project }) {
  const { language } = useTranslation();
  const copy = projectsContent[language][project.slug];
  const labels = caseLabels[language];
  const next =
    projects[
      (projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length
    ];
  return (
    <article className="section-shell pb-20 pt-28 sm:pt-36">
      <Link
        href={`/?lang=${language}#proyectos`}
        className="button-text text-muted-foreground"
      >
        <span aria-hidden="true">←</span> {labels.back}
      </Link>
      <header className="pb-10 pt-8 sm:pb-14">
        <p className="eyebrow mb-4" style={{ color: project.color }}>
          {copy.category}
        </p>
        <p className="mb-5 font-display text-2xl text-muted-foreground">
          {project.name}
        </p>
        <h1 className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.07] tracking-[-0.035em]">
          {copy.headline}
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {copy.introduction}
        </p>
        {(project.demo || project.repositories.length > 0) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary"
              >
                {labels.demo} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.repositories.map((repo) => (
              <a
                key={repo.href}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="button-outline"
              >
                {labels.code} · {repo.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </header>
      <ProjectImage
        src={project.image}
        alt={copy.coverAlt}
        width={project.imageWidth}
        height={project.imageHeight}
        eager
        caption={
          project.slug === "la-central"
            ? language === "es"
              ? "Punto de venta · Datos de demostración. Venta por gramos y por presentación."
              : "Point of sale · Demonstration data. Weighted products and pack pricing."
            : `${project.name} · ${labels.screen}`
        }
      />
      <dl className="mt-8 grid gap-6 border-b border-border pb-8 sm:grid-cols-[1.3fr_1fr_auto]">
        <div>
          <dt className="eyebrow mb-2 text-muted-foreground">{labels.role}</dt>
          <dd className="max-w-sm text-sm leading-relaxed">{copy.role}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-2 text-muted-foreground">
            {labels.status}
          </dt>
          <dd className="text-sm leading-relaxed">{copy.status}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-2 text-muted-foreground">{labels.year}</dt>
          <dd className="text-sm">{project.year}</dd>
        </div>
      </dl>
      <section className="grid gap-6 py-16 sm:py-20 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <div>
          <p className="eyebrow mb-4" style={{ color: project.color }}>
            {labels.challenge}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">
            {copy.challenge}
          </h2>
        </div>
        <p className="text-base leading-8 text-muted-foreground">
          {copy.challengeBody}
        </p>
      </section>
      <ProjectFeature slug={project.slug} />
      <section className="py-16 sm:py-20">
        <p className="eyebrow mb-5" style={{ color: project.color }}>
          {labels.decisions}
        </p>
        <div className="grid gap-x-12 sm:grid-cols-2">
          {copy.decisions.map((decision, index) => (
            <div key={decision.title} className="border-t border-border py-7">
              <span className="font-mono-tech text-xs text-muted-foreground">
                0{index + 1}
              </span>
              <h2 className="mb-4 mt-3 font-display text-2xl">
                {decision.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {decision.body}
              </p>
            </div>
          ))}
        </div>
      </section>
      {project.slug === "la-central" && (
        <div className="mb-16">
          <ProjectImage
            src="/projects/la-central-purchasing.png"
            alt={
              language === "es"
                ? "Pedido a proveedor en La Central con productos y costos"
                : "Supplier order in La Central with products and costs"
            }
            width={1366}
            height={900}
            caption={
              language === "es"
                ? "Compras · Preparación de un pedido a proveedor con datos de demostración."
                : "Purchasing · Preparing a supplier order with demonstration data."
            }
          />
        </div>
      )}
      <section className="border-y border-border py-10">
        <h2 className="eyebrow mb-8" style={{ color: project.color }}>
          {labels.evidence}
        </h2>
        <div className="grid gap-7 sm:grid-cols-3">
          {copy.evidence.map((item) => (
            <div key={item.label}>
              <p
                className="font-display text-5xl"
                style={{ color: project.color }}
              >
                {item.value}
              </p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {copy.evidenceNote}
        </p>
      </section>
      <section className="grid gap-10 py-12 md:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="eyebrow mb-5 text-muted-foreground">{labels.stack}</h2>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border px-3 py-2 text-xs"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-muted-foreground">{labels.scope}</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            {copy.scope}
          </p>
        </div>
      </section>
      <p className="max-w-3xl py-8 font-display text-2xl leading-relaxed sm:text-3xl">
        {copy.closing}
      </p>
      <div className="mt-10 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
        <Link
          href={`/proyectos/${next.slug}?lang=${language}`}
          className="group"
        >
          <p className="eyebrow mb-3 text-muted-foreground">{labels.next}</p>
          <span className="font-display text-3xl group-hover:text-accent">
            {next.name} <span aria-hidden="true">↗</span>
          </span>
        </Link>
        <div className="sm:text-right">
          <p className="mb-3 text-sm text-muted-foreground">{labels.contact}</p>
          <Link href={`/?lang=${language}#contacto`} className="button-outline">
            {labels.contactAction} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
