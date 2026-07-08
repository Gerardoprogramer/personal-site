"use client";

import type { ProjectView as Project } from "@/content/ProjectView";
import { useTranslation } from "@/lib/i18n/context";

export const TypeBadge = ({ project }: { project: Project }) => {
    const { t } = useTranslation();
    const { type, links } = project;

    const hasDemo = links?.some((l) => l.kind === "demo");
    const hasRepo = links?.some((l) => l.kind === "repo" || l.kind === "frontend" || l.kind === "backend");

    const map = {
        public:
            hasDemo && hasRepo
                ? { label: t.badges.demoRepo, tone: "text-primary" }
                : hasRepo
                    ? { label: t.badges.repoOnly, tone: "text-primary" }
                    : { label: t.badges.demoOnly, tone: "text-primary" },
        partial: { label: t.badges.partial, tone: "text-foreground" },
        confidential: { label: t.badges.confidential, tone: "text-primary" },
        "in-development": { label: t.badges.inDevelopment, tone: "text-primary" },
    } as const;

    const { label, tone } = map[type];
    const isDev = type === "in-development";

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-widest ${tone}`}
        >
            {isDev ? (
                <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-primary"
                    style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
                />
            ) : null}
            {label}
        </span>
    );
};