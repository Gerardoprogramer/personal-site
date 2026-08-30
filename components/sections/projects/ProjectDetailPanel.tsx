"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { Project } from "@/content/projects";
import type { ProjectContent } from "@/lib/i18n/projects.content";
import { getBadgeKey } from "@/lib/projects/getBadgeKey";
import { ImageCarousel } from "./ImageCarousel";

interface Props {
    project: Project;
    content: ProjectContent;
}

const labels = {
    es: {
        problem: "problema", why: "por qué lo hice", decisions: "decisiones", learned: "qué aprendí",
        noGallery: "sin capturas disponibles",
        links: { demo: "demo", frontend: "frontend", backend: "backend", repo: "repositorio" },
    },
    en: {
        problem: "problem", why: "why I built it", decisions: "decisions", learned: "what I learned",
        noGallery: "no screenshots available",
        links: { demo: "demo", frontend: "frontend", backend: "backend", repo: "repository" },
    },
};

export const ProjectDetailPanel = ({ project, content }: Props) => {
    const { t, language } = useTranslation();
    const l = labels[language];
    const badgeKey = getBadgeKey(project);
    const images = project.gallery?.map((g) => g.src) ?? [];

    const blocks = [
        { label: l.problem, text: content.problem },
        ...(content.why ? [{ label: l.why, text: content.why }] : []),
        { label: l.decisions, text: content.decisions.join(" ") },
        ...(content.learned ? [{ label: l.learned, text: content.learned }] : []),
    ];

    return (
        <div className="grid border border-border md:grid-cols-[260px_1fr]">
            <div className="relative h-50 border-b border-border md:h-auto md:border-b-0 md:border-r">
                <ImageCarousel images={images} alt={content.title} emptyLabel={l.noGallery} />
            </div>

            <div className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-foreground">{content.title}</h3>
                    <span className="font-mono-tech text-[10.5px] text-muted-foreground border border-border px-2 py-1">
                        {t.badges[badgeKey]}
                    </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{content.tagline}</p>

                {project.links && project.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {project.links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="font-mono-tech text-[11px] text-accent border border-accent/40 px-2.5 py-1 transition-colors hover:bg-accent/10"
                            >
                                {l.links[link.kind] ?? link.kind} ↗
                            </a>
                        ))}
                    </div>
                )}

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {blocks.map((b, i) => (
                        <div key={i}>
                            <div className="mb-1.5 font-mono-tech text-[10px] uppercase tracking-widest text-accent">
                                {b.label}
                            </div>
                            <p className="text-[13px] leading-relaxed text-muted-foreground">{b.text}</p>
                        </div>
                    ))}
                </div>

                {content.note && <p className="mt-5 font-mono-tech text-[11px] text-muted-foreground/70">{content.note}</p>}
            </div>
        </div >
    );
};