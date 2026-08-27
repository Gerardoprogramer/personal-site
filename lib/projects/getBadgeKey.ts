import type { Project } from "@/content/projects";

export type BadgeKey = "demoRepo" | "repoOnly" | "demoOnly" | "partial" | "confidential" | "inDevelopment";

export function getBadgeKey(project: Project): BadgeKey {
    if (project.type === "confidential") return "confidential";
    if (project.type === "in-development") return "inDevelopment";
    if (project.type === "partial") return "partial";

    const hasDemo = project.links?.some((l) => l.kind === "demo");
    const hasRepo = project.links?.some((l) => l.kind === "repo" || l.kind === "frontend" || l.kind === "backend");

    if (hasDemo && hasRepo) return "demoRepo";
    if (hasRepo) return "repoOnly";
    if (hasDemo) return "demoOnly";
    return "repoOnly";
}