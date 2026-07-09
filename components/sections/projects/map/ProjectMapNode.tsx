import type { PositionedNode } from "@/lib/map/layout";
import { nodeWidth, NODE_HEIGHT } from "@/lib/map/layout";

type Props = {
    positioned: PositionedNode;
    isActive: boolean;
    onHover: (key: string | null) => void;
    onActivate: (e: React.SyntheticEvent<SVGGElement>) => void;
};

export function ProjectMapNode({ positioned: p, isActive, onHover, onActivate }: Props) {
    const node = p.node;
    const isOverflow = node.kind === "overflow";
    const key = node.kind === "project" ? node.project.slug : `overflow-${p.cluster.id}`;
    const width = nodeWidth(node.title);

    return (
        <g
            tabIndex={0}
            role="button"
            aria-label={
                node.kind === "project"
                    ? `Abrir proyecto ${node.project.title}, contexto ${p.cluster.label}`
                    : `Ver ${node.hidden.length} proyectos más de ${p.cluster.label}`
            }
            className="cursor-pointer outline-none focus-visible:filter-[drop-shadow(0_0_8px_var(--color-primary))]"
            onMouseEnter={() => onHover(key)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(key)}
            onBlur={() => onHover(null)}
            onClick={onActivate}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onActivate(e);
                }
            }}
            style={{
                filter: isActive ? "drop-shadow(0 0 10px var(--color-primary))" : undefined,
                transition: "filter 200ms ease",
            }}
        >
            <title>{isOverflow ? `Ver ${node.hidden.length} proyectos más` : node.title}</title>
            <rect
                x={p.x - width / 2}
                y={p.y - NODE_HEIGHT / 2}
                width={width}
                height={NODE_HEIGHT}
                rx="2"
                fill="var(--color-surface-2)"
                stroke={isActive ? "var(--color-primary)" : "var(--color-border)"}
                strokeDasharray={isOverflow ? "3 2" : undefined}
            />
            <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill={isActive ? "var(--color-primary)" : "var(--color-muted-foreground)"}
            >
                {node.title}
            </text>
        </g>
    );
}