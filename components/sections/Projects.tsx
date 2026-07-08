'use client';

import { SectionHeader } from "../shared/SectionHeader"
import { useState } from "react"
import { getProjects } from "@/content/ProjectView";
import { useTranslation } from "@/lib/i18n/context";
import { FeaturedProject } from "./projects/FeaturedProject";
import { ProjectCard } from "./projects/ProjectCard";

export const Projects = () => {
    const [view, setView] = useState<"list" | "map">("list");
    const { language, t } = useTranslation();
    const projects = getProjects(language);
    const featured = projects.find((p) => p.featured)!;
    const rest = projects.filter((p) => !p.featured);

    return (
        <section id="proyectos" className="py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <SectionHeader
                        eyebrow={t.projects.eyebrow}
                        title={t.projects.title}
                        description={t.projects.description}
                    />
                    <div className="flex items-center gap-4">
                        <div
                            role="tablist"
                            aria-label="Vista de proyectos"
                            className="flex items-stretch border border-border bg-surface-2/50 font-mono-tech text-[10px] uppercase tracking-widest"
                        >
                            <button
                                type="button"
                                role="tab"
                                /* aria-selected={view === "list"}
                                onClick={() => setView("list")} */
                                className={`relative flex items-center gap-2 px-3 py-2 transition-colors ${view === "list"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <span aria-hidden="true">[</span>{t.projects.view.list}<span aria-hidden="true">]</span>
                            </button>
                            <button
                                type="button"
                                role="tab"
                                /* aria-selected={view === "map"}
                                onClick={() => setView("map")} */
                                className={`relative flex items-center gap-2 border-l border-border px-3 py-2 transition-colors ${view === "map"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <span aria-hidden="true">[</span>{t.projects.view.map}<span aria-hidden="true">]</span>
                            </button>
                        </div>
                        <div className="hidden font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
                            {projects.length.toString().padStart(2, "0")} · {t.projects.registration}
                        </div>
                    </div>
                </div>

                {view === "list" ? (
                    <div className="mt-14 space-y-6">
                        <FeaturedProject project={featured} />
                        <div className="grid items-stretch gap-6 md:grid-cols-2">
                            {rest.map((p) => (
                                <ProjectCard key={p.slug} project={p} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-14">
                        {/* <ProjectsMap projects={projects} /> */}
                    </div>
                )}
            </div>
        </section>
    )
}
