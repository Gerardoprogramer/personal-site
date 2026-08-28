"use client";

import { useMemo, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { useTranslation } from "@/lib/i18n/context";
import { projectsContent } from "@/lib/i18n/projects.content";

interface Props {
    selectedSlug: string | null;
    onSelect: (slug: string | null) => void;
}

export const ProjectsOrbit = ({ selectedSlug, onSelect }: Props) => {
    const { language } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const startX = useRef<number | null>(null);

    const active = projects[activeIndex];
    const activeContent = projectsContent[language][active.slug];

    const techPositions = useMemo(() => {
        const radius = 118;
        const n = active.stack.length;
        return active.stack.map((tech, i) => {
            const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
            return { tech, x: 140 + radius * Math.cos(angle), y: 140 + radius * Math.sin(angle) };
        });
    }, [active]);

    const goTo = (i: number) => setActiveIndex((i + projects.length) % projects.length);

    const handlePointerDown = (e: React.PointerEvent) => { startX.current = e.clientX; };
    const handlePointerUp = (e: React.PointerEvent) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 40) goTo(activeIndex + (dx < 0 ? 1 : -1));
        startX.current = null;
    };

    const isSelected = selectedSlug === active.slug;

    return (
        <div>
            <div
                className="relative mx-auto h-70 w-70 touch-pan-y"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <div className="absolute inset-0 rounded-full border border-dashed border-border" />

                {techPositions.map(({ tech, x, y }) => (
                    <div
                        key={tech}
                        style={{ left: x - 26, top: y - 26 }}
                        className="absolute flex h-13 w-13 items-center justify-center rounded-full border border-border bg-background px-1 text-center font-mono-tech text-[9px] leading-tight text-muted-foreground"
                    >
                        {tech}
                    </div>
                ))}

                <button
                    onClick={() => onSelect(isSelected ? null : active.slug)}
                    style={{ left: 140 - 52, top: 140 - 52 }}
                    className={`absolute flex h-26 w-26 items-center justify-center rounded-full border p-2 text-center font-mono-tech text-[11.5px] transition-colors ${isSelected ? "border-accent bg-accent/15 text-foreground" : "border-accent/60 bg-accent/10 text-foreground"
                        }`}
                >
                    {activeContent.title}
                </button>
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
                {projects.map((_, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-accent" : "bg-border"}`} />
                ))}
            </div>

            <div className="mt-3 flex justify-between">
                <button onClick={() => goTo(activeIndex - 1)} className="font-mono-tech text-[11px] text-muted-foreground border border-border px-3 py-1.5">
                    ← {language === "es" ? "anterior" : "prev"}
                </button>
                <button onClick={() => goTo(activeIndex + 1)} className="font-mono-tech text-[11px] text-muted-foreground border border-border px-3 py-1.5">
                    {language === "es" ? "siguiente" : "next"} →
                </button>
            </div>

            <p className="mt-2 text-center font-mono-tech text-[10.5px] text-muted-foreground/60">
                {language === "es" ? "deslizá o tocá el centro para ver el detalle" : "swipe or tap the center for details"}
            </p>
        </div>
    );
};