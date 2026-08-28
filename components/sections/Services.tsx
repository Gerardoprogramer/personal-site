'use client';

import { useState } from "react";
import { SectionHeader } from "../shared/SectionHeader"
import { Reveal } from "../shared/Reveal"
import { services } from '@/content/Services'
import { BackgroundLetter } from "../shared/BackgroundLetter";
import { useTranslation } from "@/lib/i18n/context"

export const Services = () => {
    const { t } = useTranslation();
    const [openId, setOpenId] = useState<string | null>(null);
    const items = services(t);

    return (
        <section
            id="servicios"
            className="relative overflow-hidden border-y border-border bg-surface/40 py-24"
        >
            <BackgroundLetter letter="A" />
            <div className="mx-auto max-w-6xl px-6">
                <Reveal>
                    <SectionHeader
                        eyebrow={t.services.Header.eyebrow.replace("// ", "")}
                        title={t.services.Header.title}
                        description={t.services.Header.description}
                        index="02"
                    />
                </Reveal>

                <div className="mt-14 border-t border-border">
                    {items.map((s, i) => {
                        const isOpen = openId === s.id;
                        return (
                            <Reveal key={s.id} delay={i * 60}>
                                <div className="border-b border-border">
                                    <button
                                        onClick={() => setOpenId(isOpen ? null : s.id)}
                                        aria-expanded={isOpen}
                                        className="group flex w-full items-center gap-5 py-6 text-left"
                                    >
                                        <span className="font-mono-tech text-xs text-muted-foreground">
                                            {s.id}
                                        </span>
                                        <h3
                                            className={`flex-1 font-display text-xl font-semibold tracking-tight transition-colors duration-200 ${isOpen ? "text-accent" : "text-foreground"
                                                }`}
                                        >
                                            {s.title}
                                        </h3>
                                        <span
                                            className={`font-mono-tech text-sm text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-90 text-accent" : ""
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
                                            <p className="max-w-[60ch] pb-7 pl-13 text-sm leading-relaxed text-muted-foreground">
                                                {s.body}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}