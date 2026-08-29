'use client'

import { useMemo } from "react";

type StackGroup = {
    id: string;
    label: string;
    items: string[];
    secondary?: boolean;
};

type Point = { x: number; y: number };

const CENTER: Point = { x: 450, y: 320 };
const SPACING = 58;

// Una dirección fija por cuadrante — esto es lo único "hardcodeado a mano",
// el resto (cantidad de estaciones, largo de línea) se calcula solo.
const QUADRANTS = [
    { elbow: { x: -110, y: -110 }, dir: { x: -0.18, y: -1 }, labelDx: 14, labelDy: 4, anchor: "start" as const, lineLabelOffset: { x: -60, y: -18 } },
    { elbow: { x: 110, y: -110 }, dir: { x: 0.85, y: -0.55 }, labelDx: 0, labelDy: -14, anchor: "middle" as const, lineLabelOffset: { x: 60, y: -20 } },
    { elbow: { x: -110, y: 110 }, dir: { x: -0.85, y: 0.55 }, labelDx: -14, labelDy: 18, anchor: "end" as const, lineLabelOffset: { x: -60, y: 22 } },
    { elbow: { x: 110, y: 110 }, dir: { x: 0.55, y: 0.85 }, labelDx: 14, labelDy: 4, anchor: "start" as const, lineLabelOffset: { x: 40, y: 26 } },
];

function normalize(v: Point): Point {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / len, y: v.y / len };
}

interface Line {
    group: StackGroup;
    d: string;
    stations: { name: string; x: number; y: number; isTerminus: boolean; labelX: number; labelY: number; anchor: "start" | "middle" | "end" }[];
    labelPos: Point;
}

function buildLines(groups: StackGroup[]): Line[] {
    return groups.slice(0, 4).map((group, qi) => {
        const q = QUADRANTS[qi];
        const dir = normalize(q.dir);
        const elbow = { x: CENTER.x + q.elbow.x, y: CENTER.y + q.elbow.y };

        const stations = group.items.map((item, i) => {
            const dist = SPACING * (i + 1);
            const x = elbow.x + dir.x * dist;
            const y = elbow.y + dir.y * dist;
            return {
                name: item,
                x, y,
                isTerminus: i === group.items.length - 1,
                labelX: x + q.labelDx,
                labelY: y + q.labelDy,
                anchor: q.anchor,
            };
        });

        const last = stations[stations.length - 1] ?? elbow;
        const d = `M ${CENTER.x} ${CENTER.y} L ${elbow.x} ${elbow.y} L ${last.x} ${last.y}`;

        return {
            group,
            d,
            stations,
            labelPos: { x: CENTER.x + q.elbow.x + q.lineLabelOffset.x, y: CENTER.y + q.elbow.y + q.lineLabelOffset.y },
        };
    });
}

export function MetroMap({ groups, centerLabel = "GERARDO.MM" }: { groups: StackGroup[]; centerLabel?: string }) {
    const lines = useMemo(() => buildLines(groups), [groups]);

    return (
        <div className="border border-border p-4 sm:p-6">
            <svg viewBox="-70 -75 1040 750" className="block w-full h-auto overflow-visible">
                {lines.map((line) => (
                    <path key={line.group.id} d={line.d} fill="none" className="stroke-accent" strokeWidth={3} />
                ))}

                <g>
                    <circle cx={CENTER.x} cy={CENTER.y} r={9} className="fill-background stroke-foreground" strokeWidth={3} />
                    <text
                        x={CENTER.x}
                        y={CENTER.y + 26}
                        textAnchor="middle"
                        className="fill-foreground font-mono-tech"
                        style={{ fontSize: 11 }}
                    >
                        {centerLabel}
                    </text>
                </g>

                {lines.map((line) => (
                    <g key={line.group.id}>
                        <text
                            x={line.labelPos.x}
                            y={line.labelPos.y}
                            className="fill-accent font-mono-tech uppercase"
                            style={{ fontSize: 11, letterSpacing: "0.06em" }}
                        >
                            {line.group.label}
                        </text>

                        {line.stations.map((s) => (
                            <g key={`${line.group.id}-${s.name}`} className="group cursor-pointer">
                                <circle
                                    cx={s.x}
                                    cy={s.y}
                                    r={s.isTerminus ? 7 : 6}
                                    className="fill-background stroke-foreground transition-all duration-200 group-hover:fill-accent group-hover:stroke-accent"
                                    strokeWidth={s.isTerminus ? 3 : 2.5}
                                />
                                <text
                                    x={s.labelX}
                                    y={s.labelY}
                                    textAnchor={s.anchor}
                                    className="fill-muted-foreground transition-colors duration-200 group-hover:fill-foreground"
                                    style={{ fontSize: 12.5 }}
                                >
                                    {s.name}
                                </text>
                            </g>
                        ))}
                    </g>
                ))}
            </svg>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-4">
                {lines.map((line) => (
                    <div key={line.group.id} className="flex items-center gap-2 font-mono-tech text-[11px] text-muted-foreground">
                        <span className="inline-block size-2 rounded-full border-[1.5px] border-foreground" />
                        {line.group.label}
                    </div>
                ))}
            </div>
        </div>
    );
}