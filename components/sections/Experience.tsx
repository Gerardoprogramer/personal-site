'use client'

import { SectionHeader } from "../shared/SectionHeader"
import { experience } from "@/content/Experience"
import { useTranslation } from "@/lib/i18n/context"

export const Experience = () => {
    const { t } = useTranslation();

    return (
        <section
            id="experiencia"
            className="relative border-y border-border bg-surface/40 py-24"
        >
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeader
                    eyebrow={t.experience.header.eyebrow}
                    title={t.experience.header.title}
                    description={t.experience.header.description}
                />

                <ol className="relative mt-14 space-y-6 pl-8 sm:pl-12">
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-2 top-3 bottom-3 w-px bg-linear-to-b from-primary via-border to-transparent sm:left-3"
                    />
                    {experience(t).map((exp, i) => {
                        const isCurrent = i === 0;
                        return (
                            <li key={exp.company} className="relative">
                                <span
                                    aria-hidden="true"
                                    className="absolute -left-6.5 top-8 flex size-3 items-center justify-center sm:-left-8.5"
                                >
                                    <span
                                        className={`size-3 rotate-45 border bg-background transition-colors ${isCurrent
                                            ? "border-primary shadow-[0_0_10px_var(--color-primary)]"
                                            : "border-muted-foreground/40"
                                            }`}
                                    />
                                    <span
                                        className={`absolute size-1.5 rotate-45 ${isCurrent ? "bg-primary" : "bg-muted-foreground/50"
                                            }`}
                                    />
                                    {isCurrent && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute size-3 rotate-45 animate-ping bg-primary/40"
                                        />
                                    )}
                                </span>
                                <div className="mb-2 flex items-center gap-3 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                    <span className="text-primary">
                                        {`* ${exp.company.toLowerCase().replace(/\s+/g, "-").slice(0, 6)}${(i + 1).toString().padStart(2, "0")}`}
                                    </span>
                                    <span className="h-px w-6 bg-border" />
                                    <span>({isCurrent ? "HEAD → main" : "prev"})</span>
                                </div>
                                <div className="surface-card group p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20">
                                    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
                                        <div className="border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                                            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                                                {exp.period}
                                            </div>
                                            <div className="mt-3 font-display text-xl font-semibold tracking-tight">
                                                {exp.company}
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {exp.role}
                                            </div>
                                            <div className="mt-3 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                                {exp.format}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                                {t.experience.labels.built}
                                            </div>
                                            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                                {exp.built.map((b, i) => (
                                                    <li key={i} className="flex gap-3">
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-2 size-1 shrink-0 bg-primary"
                                                        />
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-6 border-t border-border pt-4">
                                                <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                                    {t.experience.labels.learned}
                                                </div>
                                                <p className="mt-2 text-sm italic leading-relaxed text-foreground/90">
                                                    {exp.learned}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    )
}