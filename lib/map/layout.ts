import type { ProjectContext } from '@/content/projects'
import type { ProjectView as Project } from "@/content/ProjectView";

export type Cluster = {
    id: ProjectContext;
    label: string;
    angle: number;
};

export type ClusterPos = Cluster & { x: number; y: number };

export type MapNode =
    | { kind: "project"; project: Project; title: string }
    | { kind: "overflow"; title: string; hidden: Project[] };

export type PositionedNode = {
    node: MapNode;
    cluster: ClusterPos;
    angle: number;
    radius: number;
    x: number;
    y: number;
};

export const CLUSTERS: Cluster[] = [
    { id: "personal", label: "Personal", angle: 210 },
    { id: "freelance", label: "Freelance", angle: 330 },
    { id: "profesional", label: "Profesional", angle: 90 },
];

export const CX = 500;
export const CY = 320;
export const R_CLUSTER = 200;
export const R_PROJECT = 130;
export const NODE_HEIGHT = 28;

const CHAR_PX = 6.6;
const NODE_PAD = 20;
const NODE_MIN = 120;

const MAX_VISIBLE_PER_CLUSTER = 4;

const GAP_PX = 14;
const MAX_SPREAD = 130;
const PAD_X = 20;
const PAD_Y = 20;

export function round(n: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round(n * factor) / factor;
}

export function polar(cx: number, cy: number, r: number, deg: number) {
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

export function nodeWidth(title: string): number {
    return Math.max(NODE_MIN, title.length * CHAR_PX + NODE_PAD);
}

export function getClusterPositions(): ClusterPos[] {
    return CLUSTERS.map((c) => ({ ...c, ...polar(CX, CY, R_CLUSTER, c.angle) }));
}

export function layoutCluster(cluster: ClusterPos, allProjects: Project[]): PositionedNode[] {
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

    const widths = nodes.map((n) => nodeWidth(n.title));

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

export function keyFor(p: PositionedNode): string {
    return p.node.kind === "project" ? p.node.project.slug : `overflow-${p.cluster.id}`;
}