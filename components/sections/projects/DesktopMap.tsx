import { useEffect, useRef, useState } from "react";
import { ProjectContext } from '@/content/projects'
import { DetailCard } from "@/components/shared/DetailCard";
import type { ProjectView as Project } from "@/content/ProjectView";
import { FaArrowLeft } from "react-icons/fa";


type Cluster = {
    id: ProjectContext;
    label: string;
    angle: number;
};

const CLUSTERS: Cluster[] = [
    { id: "personal", label: "Personal", angle: 210 },
    { id: "freelance", label: "Freelance", angle: 330 },
    { id: "profesional", label: "Profesional", angle: 90 },
];

const CX = 500;
const CY = 320;
const R_CLUSTER = 200;
const R_PROJECT = 130;
const CHAR_PX = 6.6;
const NODE_PAD = 20;
const NODE_MIN = 120;
const NODE_HEIGHT = 28;

// Cuántos proyectos como máximo se muestran por cluster antes de colapsar en "+N más"
const MAX_VISIBLE_PER_CLUSTER = 4;

const GAP_PX = 14;
const MAX_SPREAD = 130;
const PAD_X = 20;
const PAD_Y = 20;

function round(n: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round(n * factor) / factor;
}

function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg - 90) * (Math.PI / 180);
    return {
        x: round(cx + r * Math.cos(rad)),
        y: round(cy + r * Math.sin(rad)),
    };
}

function maxRadiusInBounds(
    originX: number, originY: number,
    dx: number, dy: number,
    halfW: number, halfH: number
) {
    let r = Infinity;
    if (dx > 0) r = Math.min(r, (1000 - PAD_X - halfW - originX) / dx);
    if (dx < 0) r = Math.min(r, (PAD_X + halfW - originX) / dx);
    if (dy > 0) r = Math.min(r, (640 - PAD_Y - halfH - originY) / dy);
    if (dy < 0) r = Math.min(r, (PAD_Y + halfH - originY) / dy);
    return r;
}

type MapNode =
    | { kind: "project"; project: Project; title: string }
    | { kind: "overflow"; title: string; hidden: Project[] };

type ClusterPos = { id: ProjectContext; label: string; angle: number; x: number; y: number };

type PositionedNode = {
    node: MapNode;
    cluster: ClusterPos;
    angle: number;
    radius: number;
    x: number;
    y: number;
};

function layoutCluster(cluster: ClusterPos, allProjects: Project[]): PositionedNode[] {
    if (allProjects.length === 0) return [];

    const hasOverflow = allProjects.length > MAX_VISIBLE_PER_CLUSTER;
    const visibleProjects = hasOverflow
        ? allProjects.slice(0, MAX_VISIBLE_PER_CLUSTER - 1)
        : allProjects;
    const hiddenProjects = hasOverflow
        ? allProjects.slice(MAX_VISIBLE_PER_CLUSTER - 1)
        : [];

    const nodes: MapNode[] = visibleProjects.map((p) => ({
        kind: "project",
        project: p,
        title: p.title,
    }));
    if (hasOverflow) {
        nodes.push({
            kind: "overflow",
            title: `+${hiddenProjects.length} más`,
            hidden: hiddenProjects,
        });
    }

    const widths = nodes.map((n) => Math.max(NODE_MIN, n.title.length * CHAR_PX + NODE_PAD));

    if (nodes.length === 1) {
        const rad = (cluster.angle - 90) * (Math.PI / 180);
        const dx = Math.cos(rad), dy = Math.sin(rad);
        const boundMax = maxRadiusInBounds(cluster.x, cluster.y, dx, dy, widths[0] / 2, NODE_HEIGHT / 2);
        const radius = Math.min(R_PROJECT, boundMax);
        const pos = polar(cluster.x, cluster.y, radius, cluster.angle);
        return [{ node: nodes[0], cluster, angle: cluster.angle, radius, ...pos }];
    }

    // radio "de deseo" para separar por ángulo
    let radius = R_PROJECT;
    let halfAngles: number[] = [];
    let totalSpread = 0;

    while (true) {
        halfAngles = widths.map(
            (w) => (Math.atan((w / 2 + GAP_PX / 2) / radius) * 180) / Math.PI
        );
        totalSpread = halfAngles.reduce(
            (sum, h, i) => (i === 0 ? 0 : sum + h + halfAngles[i - 1]),
            0
        );
        if (totalSpread <= MAX_SPREAD || radius >= 300) break;
        radius += 15;
    }

    // capar el radio para que no se salga del viewBox
    const maxHalfWidth = Math.max(...widths) / 2;
    let boundCap = Infinity;
    for (const h of [-MAX_SPREAD / 2, 0, MAX_SPREAD / 2]) {
        const angle = cluster.angle + h;
        const rad = (angle - 90) * (Math.PI / 180);
        const dx = Math.cos(rad), dy = Math.sin(rad);
        boundCap = Math.min(boundCap, maxRadiusInBounds(cluster.x, cluster.y, dx, dy, maxHalfWidth, NODE_HEIGHT / 2));
    }
    radius = Math.min(radius, Math.max(boundCap, R_PROJECT * 0.6));

    // recalcular ángulos al radio final
    halfAngles = widths.map(
        (w) => (Math.atan((w / 2 + GAP_PX / 2) / radius) * 180) / Math.PI
    );
    totalSpread = halfAngles.reduce(
        (sum, h, i) => (i === 0 ? 0 : sum + h + halfAngles[i - 1]),
        0
    );
    const scale = totalSpread > MAX_SPREAD ? MAX_SPREAD / totalSpread : 1;

    let cursor = cluster.angle - (totalSpread * scale) / 2;
    return nodes.map((node, i) => {
        if (i > 0) cursor += (halfAngles[i - 1] + halfAngles[i]) * scale;
        const pos = polar(cluster.x, cluster.y, radius, cursor);
        return { node, cluster, angle: cursor, radius, ...pos };
    });
}

type DesktopMapProps = {
    projects: Project[];
    selectedSlug: string | null;
    onSelectSlug: (slug: string | null) => void;
};

export const DesktopMap = ({ projects, selectedSlug, onSelectSlug }: DesktopMapProps) => {

    const [overflowClusterId, setOverflowClusterId] = useState<ProjectContext | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const lastFocusRef = useRef<HTMLElement | null>(null);

    const activeOverlay = selectedSlug !== null || overflowClusterId !== null;

    useEffect(() => {
        if (activeOverlay && closeRef.current) closeRef.current.focus();
    }, [activeOverlay]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && activeOverlay) {
                onSelectSlug(null);
                setOverflowClusterId(null);
                lastFocusRef.current?.focus();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeOverlay]);

    const clusterPositions: ClusterPos[] = CLUSTERS.map((c) => ({
        ...c,
        ...polar(CX, CY, R_CLUSTER, c.angle),
    }));

    const projectPositions = clusterPositions.flatMap((cluster) =>
        layoutCluster(cluster, projects.filter((p) => p.context === cluster.id))
    );

    const selected = selectedSlug
        ? projects.find((p) => p.slug === selectedSlug) ?? null
        : null;

    const overflowClusterInfo = overflowClusterId
        ? clusterPositions.find((c) => c.id === overflowClusterId) ?? null
        : null;

    const overflowHidden = overflowClusterId
        ? projectPositions
            .filter(
                (p): p is PositionedNode & { node: { kind: "overflow" } } =>
                    p.cluster.id === overflowClusterId && p.node.kind === "overflow"
            )
            .flatMap((p) => p.node.hidden)
        : [];

    function closeOverlay() {
        onSelectSlug(null);
        setOverflowClusterId(null);
        lastFocusRef.current?.focus();
    }

    return (
        <div className="surface-card relative hidden overflow-hidden md:block">
            <div className="blueprint-grid absolute inset-0 opacity-60 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/60" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-primary/60" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-primary/60" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-primary/60" />

            <div className="pointer-events-none absolute left-6 top-6 font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                fig.02 — proyectos / map
            </div>
            <div className="pointer-events-none absolute right-6 top-6 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                {projects.length.toString().padStart(2, "0")} · nodos
            </div>

            <svg
                viewBox="0 0 1000 640"
                className="relative block w-full"
                role="group"
                aria-label="Mapa de proyectos agrupados por contexto"
            >
                {/* Center → cluster lines */}
                <g
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                    opacity="0.6"
                >
                    {clusterPositions.map((c) => (
                        <line key={c.id} x1={CX} y1={CY} x2={c.x} y2={c.y} />
                    ))}
                </g>

                {/* Cluster → node lines */}
                <g
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    fill="none"
                >
                    {projectPositions.map((p) => {
                        const key = p.node.kind === "project" ? p.node.project.slug : `overflow-${p.cluster.id}`;
                        const active =
                            hovered === key ||
                            (p.node.kind === "project" && selected?.slug === p.node.project.slug);
                        return (
                            <line
                                key={key}
                                x1={p.cluster.x}
                                y1={p.cluster.y}
                                x2={p.x}
                                y2={p.y}
                                stroke="var(--color-primary)"
                                opacity={active ? 0.9 : 0.35}
                            />
                        );
                    })}
                </g>

                {/* Cluster nodes */}
                {clusterPositions.map((c) => (
                    <g key={c.id}>
                        <rect
                            x={c.x - 60}
                            y={c.y - 16}
                            width="120"
                            height="32"
                            rx="2"
                            fill="var(--color-surface-2)"
                            stroke="var(--color-primary)"
                            strokeOpacity="0.5"
                        />
                        <text
                            x={c.x}
                            y={c.y + 4}
                            textAnchor="middle"
                            fontSize="11"
                            fontFamily="JetBrains Mono, monospace"
                            fill="var(--color-primary)"
                            letterSpacing="1.5"
                        >
                // {c.label.toUpperCase()}
                        </text>
                    </g>
                ))}

                {/* Center hex */}
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

                {/* Nodes (project buttons + overflow buttons) */}
                {projectPositions.map((p) => {
                    const node = p.node; // narrowing local: evita el problema de closures con discriminated unions
                    const isOverflow = node.kind === "overflow";
                    const key = node.kind === "project" ? node.project.slug : `overflow-${p.cluster.id}`;
                    const active =
                        hovered === key ||
                        (node.kind === "project" && selected?.slug === node.project.slug);
                    const label = node.title;
                    const width = Math.max(NODE_MIN, label.length * CHAR_PX + NODE_PAD);

                    function handleActivate(e: React.SyntheticEvent) {
                        lastFocusRef.current = e.currentTarget as unknown as HTMLElement;
                        if (node.kind === "project") {
                            onSelectSlug(node.project.slug);
                        } else {
                            setOverflowClusterId(p.cluster.id);
                        }
                    }

                    return (
                        <g
                            key={key}
                            tabIndex={0}
                            role="button"
                            aria-label={
                                node.kind === "project"
                                    ? `Abrir proyecto ${node.project.title}, contexto ${p.cluster.label}`
                                    : `Ver ${node.hidden.length} proyectos más de ${p.cluster.label}`
                            }
                            className="cursor-pointer outline-none focus-visible:filter-[drop-shadow(0_0_8px_var(--color-primary))]"
                            onMouseEnter={() => setHovered(key)}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered(key)}
                            onBlur={() => setHovered(null)}
                            onClick={handleActivate}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleActivate(e);
                                }
                            }}
                            style={{
                                filter: active
                                    ? "drop-shadow(0 0 10px var(--color-primary))"
                                    : undefined,
                                transition: "filter 200ms ease",
                            }}
                        >
                            <title>{isOverflow && node.kind === "overflow" ? `Ver ${node.hidden.length} proyectos más` : label}</title>
                            <rect
                                x={p.x - width / 2}
                                y={p.y - NODE_HEIGHT / 2}
                                width={width}
                                height={NODE_HEIGHT}
                                rx="2"
                                fill="var(--color-surface-2)"
                                stroke={active ? "var(--color-primary)" : "var(--color-border)"}
                                strokeDasharray={isOverflow ? "3 2" : undefined}
                            />
                            <text
                                x={p.x}
                                y={p.y + 4}
                                textAnchor="middle"
                                fontSize="10"
                                fontFamily="JetBrains Mono, monospace"
                                fill={active ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Overlay: project detail */}
            {selected ? (
                <div
                    className="absolute inset-0 overflow-y-auto bg-background/70 backdrop-blur-sm"
                    style={{ animation: "map-fade-in 180ms ease-out both" }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Detalle del proyecto ${selected.slug}`}
                >
                    <div className="flex min-h-full items-center justify-center p-6">
                        <div
                            className={`relative w-full ${selected.featured ? "max-w-5xl" : "max-w-xl"}`}
                            style={{ animation: "map-materialize 260ms cubic-bezier(0.16,1,0.3,1) both" }}
                        >
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={closeOverlay}
                                className="sticky top-0 z-10 mb-3 inline-flex items-center gap-2 border-b border-border bg-background/90 pb-0.5 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
                            >
                                <FaArrowLeft /> volver al mapa
                            </button>
                            <DetailCard project={selected} />
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Overlay: overflow list */}
            {overflowClusterInfo ? (
                <div
                    className="absolute inset-0 overflow-y-auto bg-background/70 backdrop-blur-sm"
                    style={{ animation: "map-fade-in 180ms ease-out both" }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Más proyectos de ${overflowClusterInfo.label}`}
                >
                    <div className="flex min-h-full items-center justify-center p-6">
                        <div
                            className="relative w-full max-w-2xl"
                            style={{ animation: "map-materialize 260ms cubic-bezier(0.16,1,0.3,1) both" }}
                        >
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={closeOverlay}
                                className="sticky top-0 z-10 mb-3 inline-flex items-center gap-2 border-b border-border bg-background/90 pb-0.5 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
                            >
                                <FaArrowLeft /> volver al mapa
                            </button>

                            <div className="surface-card border border-primary/40 p-6">
                                <div className="mb-4 font-mono-tech text-[11px] uppercase tracking-widest text-primary">
                                    // {overflowClusterInfo.label.toUpperCase()} — proyectos adicionales
                                </div>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {overflowHidden.map((project) => (
                                        <button
                                            key={project.slug}
                                            type="button"
                                            onClick={(e) => {
                                                lastFocusRef.current = e.currentTarget as unknown as HTMLElement;
                                                setOverflowClusterId(null);
                                                onSelectSlug(project.slug);
                                            }}
                                            className="border border-border bg-(--color-surface-2) px-4 py-3 text-left font-mono-tech text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                                        >
                                            {project.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}