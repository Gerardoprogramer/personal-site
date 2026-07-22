import type { ProjectView as Project } from "@/content/ProjectView";
import { TypeBadge } from "@/components/shared/TypeBadge";
import { ContextTag } from "@/components/shared/ContextTag";
import { StackChips } from "@/components/shared/StackChips";
import { useTranslation } from "@/lib/i18n/context";
import { RxArrowTopRight } from "react-icons/rx";
import { GalleryButton } from '@/components/sections/projects/GalleryButton'

export const ProjectCard = ({ project, full = false, }: { project: Project; full?: boolean; }) => {
    const { t } = useTranslation();

    return (
        <article className="surface-card group flex h-full flex-col p-6 transition-colors hover:border-primary/40">
            <div className="mb-4 flex items-center justify-between gap-3">
                <TypeBadge project={project} />
                <ContextTag context={project.context} />
            </div>
            <h3 className="font-display text-xl font-semibold tracking-tight">
                {project.title}
            </h3>
            <p
                className={`mt-2 text-sm leading-relaxed text-muted-foreground ${full ? "" : "line-clamp-2"
                    }`}
            >
                {project.tagline}
            </p>

            {project.type === "confidential" ? (
                <div className="mt-5 space-y-3 rounded-sm border border-dashed border-border bg-surface-2/50 p-4">
                    <div>
                        <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                            {t.projects.cardTitle1}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {project.problem}
                        </p>
                    </div>
                    <div>
                        <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                            {t.projects.cardTitle2}
                        </div>
                        <ul className="mt-1 space-y-1 text-xs leading-relaxed text-muted-foreground">
                            {(full ? project.decisions : project.decisions.slice(0, 2)).map((d, i) => (
                                <li key={i} className="flex gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="mt-1.5 size-1 shrink-0 bg-primary"
                                    />
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {project.architecture ? (
                        <div>
                            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                {t.projects.cardTitle3}
                            </div>
                            <p className="mt-1 text-xs font-medium text-foreground">
                                {project.architecture}
                            </p>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="mt-5">
                    <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                        {t.projects.cardTitle1}
                    </div>
                    <p
                        className={`mt-1 text-xs leading-relaxed text-muted-foreground ${full ? "" : "line-clamp-4"
                            }`}
                    >
                        {project.problem}
                    </p>
                    {full && project.architecture ? (
                        <div className="mt-3">
                            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                {t.projects.cardTitle3}
                            </div>
                            <p className="mt-1 text-xs font-medium text-foreground">
                                {project.architecture}
                            </p>
                        </div>
                    ) : null}
                </div>
            )}

            {project.impact ? (
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                    {project.impact.slice(0, 4).map((m) => (
                        <div key={m.labelKey}>
                            <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                {m.labelKey}
                            </dt>
                            <dd className="mt-0.5 font-display text-sm font-semibold text-primary">
                                {m.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            ) : null}

            <div className="mt-auto pt-6">
                <div className="mb-4 border-t border-border pt-4">
                    <StackChips stack={full ? project.stack : project.stack.slice(0, 5)} />
                </div>
                {project.links?.length ? (
                    <div className="flex flex-wrap gap-3">
                        {project.links.map((l) => (
                            <a
                                key={l.labelKey}
                                href={l.href}
                                aria-label={`${l.labelKey} — ${project.title}`}
                                className="inline-flex items-center gap-1 font-mono-tech text-xs text-foreground transition-colors hover:text-primary"
                            >
                                {l.labelKey}{" "}
                                <span aria-hidden="true">
                                    {l.kind === "demo" ? <RxArrowTopRight /> : "{ }"}
                                </span>
                            </a>
                        ))}

                        {project.gallery?.length ? (
                            <GalleryButton images={project.gallery} projectTitle={project.title} />
                        ) : null}
                    </div>
                ) : project.note ? (
                    <>
                        <p className="font-mono-tech text-[11px] italic text-muted-foreground">
                            {project.note}
                        </p>

                        {project.gallery?.length ? (
                            <GalleryButton images={project.gallery} projectTitle={project.title} />
                        ) : null}
                    </>
                ) : null}
            </div>
        </article>
    )
}
