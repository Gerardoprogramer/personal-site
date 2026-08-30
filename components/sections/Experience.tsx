'use client'

import { useState } from "react";
import { SectionHeader } from "../shared/SectionHeader"
import { Reveal } from "../shared/Reveal"
import { experience } from "@/content/Experience"
import { BackgroundLetter } from "../shared/BackgroundLetter"
import { useTranslation } from "@/lib/i18n/context"

export const Experience = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const items = experience(t);

    const depthLabels = ["superficie", "−1.2m", "−2.4m", "−3.6m"];

    return (
        <section
            id="experiencia"
            className="relative overflow-hidden border-y border-border bg-surface/40 py-24"
        >
            <BackgroundLetter letter="D" />
            <div className="mx-auto max-w-6xl px-6">
                <Reveal>
                    <SectionHeader
                        eyebrow={t.experience.header.eyebrow.replace("// ", "")}
                        title={t.experience.header.title}
                        description={t.experience.header.description}
                        index="04"
                    />
                </Reveal>

                <Reveal delay={120}>
                    <div className="mt-14 border border-border">
                        <div className="h-0.5 bg-linear-to-r from-accent to-transparent" />

                        {items.map((exp, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div
                                    key={exp.company}
                                    className={`border-b border-border/40 last:border-b-0 transition-colors duration-300 ${isOpen ? "bg-accent/5" : "hover:bg-accent/5"
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center gap-5 px-6 py-5 text-left sm:gap-6 sm:px-7"
                                    >
                                        <span className="hidden w-16 shrink-0 font-mono-tech text-[10px] text-muted-foreground/60 sm:inline">
                                            {depthLabels[i] ?? `−${i * 1.2}m`}
                                        </span>
                                        <span className="w-11 shrink-0 font-mono-tech text-xs text-accent">
                                            {exp.period}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-display text-lg font-semibold text-foreground sm:text-xl">
                                                {exp.role}
                                            </div>
                                            <div className="truncate text-xs text-muted-foreground sm:text-sm">
                                                {exp.company} — {exp.format}
                                            </div>
                                        </div>
                                        <span
                                            className={`shrink-0 font-mono-tech text-xs text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-90 text-accent" : ""
                                                }`}
                                        >
                                            ▸
                                        </span>
                                    </button>

                                    <div
                                        className="grid transition-[grid-template-rows] duration-300 ease-out"
                                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="grid gap-6 px-6 pb-7 pt-1 sm:grid-cols-2 sm:px-7 sm:pl-31">
                                                <div>
                                                    <div className="font-mono-tech text-[10px] uppercase tracking-widest text-accent">
                                                        {t.experience.labels.built}
                                                    </div>
                                                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                                        {exp.built.map((b, bi) => (
                                                            <li key={bi} className="flex gap-2.5">
                                                                <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-muted-foreground/50" />
                                                                <span>{b}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <div className="font-mono-tech text-[10px] uppercase tracking-widest text-accent">
                                                        {t.experience.labels.learned}
                                                    </div>
                                                    <p className="mt-3 font-display text-base italic leading-snug text-foreground">
                                                        {exp.learned}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </section>
    )
}