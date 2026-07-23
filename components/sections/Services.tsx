'use client';

import { SectionHeader } from "../shared/SectionHeader"
import { services } from '@/content/Services'
import { useTranslation } from "@/lib/i18n/context"

export const Services = () => {

    const { t } = useTranslation();

    return (
        <section
            id="servicios"
            className="relative border-y border-border bg-surface/40 py-24"
        >
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeader
                    eyebrow={t.services.Header.eyebrow}
                    title={t.services.Header.title}
                    description={t.services.Header.description}
                />

                <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                    {services(t).map((s) => (
                        <div
                            key={s.id}
                            className="group relative bg-background p-8 transition-all duration-300 hover:z-10 hover:bg-surface hover:shadow-lg hover:shadow-black/20"
                        >
                            <div className="flex items-baseline gap-3">
                                <span className="font-mono-tech text-xs font-semibold text-primary">
                                    {s.id}
                                </span>
                                <span className="relative h-px flex-1 overflow-hidden bg-border">
                                    <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100" />
                                </span>
                                <s.icon className="size-3.5 text-primary/60 transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_6px_var(--color-primary)]" />
                                <span className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary">
                                    {t.services.disponible}
                                </span>
                            </div>
                            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-0.5">
                                {s.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {s.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}