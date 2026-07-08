import type { ProjectView as Project } from "@/content/ProjectView";
import { TypeBadge } from "@/components/shared/TypeBadge";
import { ContextTag } from "@/components/shared/ContextTag";
import { StackChips } from "@/components/shared/StackChips";
import { useTranslation } from "@/lib/i18n/context";

export const FeaturedProject = ({ project }: { project: Project }) => {
    const { t } = useTranslation();

    return (
        <article className="surface-card group relative overflow-hidden">
            <div className="grid lg:grid-cols-[1.35fr_1fr]">
                <div className="border-b border-border p-8 lg:border-b-0 lg:border-r lg:p-12">
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <TypeBadge project={project} />
                        <span className="h-3 w-px bg-border" />
                        <ContextTag context={project.context} />
                        <span className="h-3 w-px bg-border" />
                        <span className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                            {project.year}
                        </span>
                    </div>

                    <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                        {project.title}
                    </h3>
                    <p className="mt-3 text-lg text-muted-foreground">
                        {project.tagline}
                    </p>

                    <div className="mt-8 space-y-6">
                        <div>
                            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                                {t.projects.FeaturedTitle1}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {project.problem}
                            </p>
                        </div>
                        <div>
                            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                                {t.projects.FeaturedTitle2}
                            </div>
                            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                {project.decisions.map((d, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span
                                            aria-hidden="true"
                                            className="mt-2 size-1 shrink-0 bg-primary"
                                        />
                                        <span>{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6">
                        <StackChips stack={project.stack} />
                    </div>
                </div>

                <div className="flex flex-col justify-between bg-surface-2/40 p-8 lg:p-10">
                    {project.impact ? (
                        <dl className="grid grid-cols-1 gap-6 border-b border-border pb-8">
                            {project.impact.map((m) => (
                                <div key={m.labelKey}>
                                    <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                        {m.labelKey}
                                    </dt>
                                    <dd className="mt-2 font-display text-3xl font-semibold text-primary text-glow">
                                        {m.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    ) : null}

                    <div className="mt-8 space-y-4">
                        {project.architecture ? (
                            <div>
                                <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                    arquitectura
                                </div>
                                <div className="mt-1 font-display text-sm font-medium">
                                    {project.architecture}
                                </div>
                            </div>
                        ) : null}

                        {project.links?.length ? (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {project.links.map((l) => (
                                    <a
                                        key={l.labelKey}
                                        href={l.href}
                                        className="inline-flex items-center gap-2 border-b border-border pb-0.5 font-mono-tech text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                                    >
                                        {l.labelKey}{" "}
                                        <span aria-hidden="true">
                                            {l.kind === "demo" ? "↗" : "{ }"}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        ) : project.note ? (
                            <p className="font-mono-tech text-[11px] italic text-muted-foreground">
                                {project.note}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </article>
    )
}
