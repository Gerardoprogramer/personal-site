"use client";

import { useEffect, useRef, useState } from "react";
import { computeGraphLayout, type GraphData } from "@/lib/projects/graphLayout";
import { useTranslation } from "@/lib/i18n/context";
import { projectsContent } from "@/lib/i18n/projects.content";

interface Props {
    selectedSlug: string | null;
    onSelect: (slug: string | null) => void;
}

export const ProjectsGraph = ({ selectedSlug, onSelect }: Props) => {
    const { language } = useTranslation();
    const stageRef = useRef<HTMLDivElement>(null);
    const [graph, setGraph] = useState<GraphData | null>(null);
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        if (!stageRef.current) return;
        const { width, height } = stageRef.current.getBoundingClientRect();
        const g = computeGraphLayout(width, height);
        setGraph(g);
        const initial: Record<string, { x: number; y: number }> = {};
        g.projectNodes.forEach((n) => (initial[n.id] = { x: n.x, y: n.y }));
        g.techNodes.forEach((n) => (initial[n.id] = { x: n.x, y: n.y }));
        setPositions(initial);
    }, []);

    if (!graph) return <div ref={stageRef} className="h-115 border border-border" />;

    const relatedTo = (id: string) => {
        const set = new Set([id]);
        graph.edges.forEach((e) => { if (e.from === id) set.add(e.to); if (e.to === id) set.add(e.from); });
        return set;
    };
    const related = hovered ? relatedTo(hovered) : null;

    const handleDrag = (id: string, e: React.PointerEvent) => {
        const rect = stageRef.current!.getBoundingClientRect();
        const move = (ev: PointerEvent) => {
            setPositions((prev) => ({
                ...prev,
                [id]: {
                    x: Math.max(20, Math.min(rect.width - 20, ev.clientX - rect.left)),
                    y: Math.max(20, Math.min(rect.height - 20, ev.clientY - rect.top)),
                },
            }));
        };
        const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    return (
        <div>
            <div ref={stageRef} className="relative h-115 overflow-hidden border border-border bg-surface/30">
                <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    {graph.edges.map((e, i) => {
                        const from = positions[e.from];
                        const to = positions[e.to];
                        if (!from || !to) return null;
                        const lit = related && related.has(e.from) && related.has(e.to);
                        return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={lit ? "var(--color-accent)" : "var(--color-border)"} strokeWidth={lit ? 1.5 : 1} />;
                    })}
                </svg>

                {graph.projectNodes.map((n) => {
                    const pos = positions[n.id] ?? n;
                    const dimmed = related ? !related.has(n.id) : false;
                    const content = projectsContent[language][n.id];
                    const isSelected = selectedSlug === n.id;
                    return (
                        <div
                            key={n.id}
                            onPointerDown={(e) => handleDrag(n.id, e)}
                            onMouseEnter={() => setHovered(n.id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => onSelect(isSelected ? null : n.id)}
                            style={{ left: pos.x, top: pos.y }}
                            className={`absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1.5 transition-opacity ${dimmed ? "opacity-25" : ""}`}
                        >
                            <div className={`size-16 rounded-full border bg-background transition-colors ${isSelected ? "border-accent bg-accent/10" : "border-border"}`} />
                            <span className="max-w-27.5 text-center font-mono-tech text-[11px] text-foreground">{content?.title ?? n.id}</span>
                        </div>
                    );
                })}

                {graph.techNodes.map((n) => {
                    const pos = positions[n.id] ?? n;
                    const dimmed = related ? !related.has(n.id) : false;
                    const lit = related?.has(n.id);
                    return (
                        <div key={n.id} onPointerDown={(e) => handleDrag(n.id, e)} style={{ left: pos.x, top: pos.y }} className={`absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1 transition-opacity ${dimmed ? "opacity-25" : ""}`}>
                            <div className={`size-8 rounded-full border bg-background ${lit ? "border-accent" : "border-border"}`} />
                            <span className={`font-mono-tech text-[9px] ${lit ? "text-accent" : "text-muted-foreground"}`}>{n.id}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};