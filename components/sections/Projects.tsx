"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";
import { ProjectsGraph } from "./projects/ProjectsGraph";
import { ProjectsOrbit } from "./projects/ProjectsOrbit";
import { ProjectDetailPanel } from "./projects/ProjectDetailPanel";
import { useProjectsViewState } from "@/hooks/useProjectsViewState";
import { projects } from "@/content/projects";
import { projectsContent } from "@/lib/i18n/projects.content";

export const Projects = () => {
    const { t, language } = useTranslation();
    const { view, setView, selectedSlug, setSelectedSlug } = useProjectsViewState();

    useEffect(() => {
        if (view !== "map") setView("map");
    }, [view, setView]);

    const selectedProject = projects.find((p) => p.slug === selectedSlug);

    return (
        <section id="proyectos" className="relative overflow-hidden py-24">
            <BackgroundLetter letter="R" />
            <div className="relative mx-auto max-w-6xl px-6">
                <SectionHeader eyebrow={t.projects.eyebrow.replace("// ", "")} title={t.projects.title} description={t.projects.description} index="01"/>

                <div className="mt-14 hidden md:block">
                    <ProjectsGraph selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
                </div>

                <div className="mt-14 md:hidden">
                    <ProjectsOrbit selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
                </div>

                {selectedProject && (
                    <div className="mt-8">
                        <ProjectDetailPanel project={selectedProject} content={projectsContent[language][selectedProject.slug]} />
                    </div>
                )}
            </div>
        </section>
    );
};