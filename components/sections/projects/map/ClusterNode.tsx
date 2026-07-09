import type { ClusterPos } from "@/lib/map/layout";

export function ClusterNode({ cluster }: { cluster: ClusterPos }) {
    return (
        <g>
            <rect
                x={cluster.x - 60}
                y={cluster.y - 16}
                width="120"
                height="32"
                rx="2"
                fill="var(--color-surface-2)"
                stroke="var(--color-primary)"
                strokeOpacity="0.5"
            />
            <text
                x={cluster.x}
                y={cluster.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fill="var(--color-primary)"
                letterSpacing="1.5"
            >
                // {cluster.label.toUpperCase()}
            </text>
        </g>
    );
}