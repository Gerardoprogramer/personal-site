import type { ClusterPos, PositionedNode } from "@/lib/map/layout";
import { CX, CY, keyFor } from "@/lib/map/layout";

export function ClusterLinks({ clusters }: { clusters: ClusterPos[] }) {
    return (
        <g stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.6">
            {clusters.map((c) => (
                <line key={c.id} x1={CX} y1={CY} x2={c.x} y2={c.y} />
            ))}
        </g>
    );
}

export function NodeLinks({
    positions,
    isActive,
}: {
    positions: PositionedNode[];
    isActive: (key: string) => boolean;
}) {
    return (
        <g strokeWidth="1" strokeDasharray="3 4" fill="none">
            {positions.map((p) => {
                const key = keyFor(p);
                return (
                    <line
                        key={key}
                        x1={p.cluster.x}
                        y1={p.cluster.y}
                        x2={p.x}
                        y2={p.y}
                        stroke="var(--color-primary)"
                        opacity={isActive(key) ? 0.9 : 0.35}
                    />
                );
            })}
        </g>
    );
}