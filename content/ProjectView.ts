import type { Language } from "@/lib/i18n/context";
import { projects, type Project } from "./projects";
import { projectsContent } from "@/lib/i18n/projects.content";

export interface ProjectView extends Omit<Project, "gallery"> {
    gallery?: {
        src: string;
        caption?: string;
    }[];

    title: string;
    tagline: string;
    problem: string;
    decisions: string[];
    architecture?: string;
    note?: string;
}

export function getProjects(language: Language): ProjectView[] {
    return projects.map((project) => {
        const content = projectsContent[language][project.slug as keyof typeof projectsContent["es"]];
        return {
            ...project,
            ...content,
            gallery: project.gallery?.map((image, index) => ({
                ...image,
                ...content.gallery?.[index],
            })),
        };
    });
}