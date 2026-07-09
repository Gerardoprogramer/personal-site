import { CX, CY } from "@/lib/map/layout";

export function CenterHex() {
    return (
        <g>
            <polygon
                points={`${CX},${CY - 42} ${CX + 36},${CY - 21} ${CX + 36},${CY + 21} ${CX},${CY + 42} ${CX - 36},${CY + 21} ${CX - 36},${CY - 21}`}
                fill="oklch(0.85 0.16 195 / 0.08)"
                stroke="var(--color-primary)"
                strokeWidth="1.2"
            />
            <text
                x={CX}
                y={CY - 2}
                textAnchor="middle"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill="var(--color-primary)"
                letterSpacing="1"
            >
                GERARDO
            </text>
            <text
                x={CX}
                y={CY + 12}
                textAnchor="middle"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                fill="var(--color-muted-foreground)"
            >
                index.root
            </text>
        </g>
    );
}