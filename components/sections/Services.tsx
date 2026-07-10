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
                            className="group bg-background p-8 transition-colors hover:bg-surface"
                        >
                            <div className="flex items-baseline gap-3">
                                <span className="font-mono-tech text-xs font-semibold text-primary">
                                    {s.id}
                                </span>
                                <span className="h-px flex-1 bg-border" />
                                <span className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                    {t.services.disponible}
                                </span>
                            </div>
                            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
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
