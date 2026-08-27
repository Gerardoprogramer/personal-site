import { projects, type Project } from "@/content/projects";

export interface GraphNode { id: string; x: number; y: number; }
export interface GraphData {
    projectNodes: (GraphNode & { project: Project })[];
    techNodes: GraphNode[];
    edges: { from: string; to: string }[];
}

export function computeGraphLayout(width: number, height: number): GraphData {
    const cx = width / 2;
    const cy = height / 2;
    const innerR = Math.min(width, height) * 0.22;
    const outerR = Math.min(width, height) * 0.42;

    const projectNodes = projects.map((p, i) => {
        const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
        return { id: p.slug, x: cx + innerR * Math.cos(angle), y: cy + innerR * Math.sin(angle), project: p };
    });

    const uniqueTech = Array.from(new Set(projects.flatMap((p) => p.stack)));
    const techNodes = uniqueTech.map((t, i) => {
        const angle = (i / uniqueTech.length) * Math.PI * 2 - Math.PI / 2;
        return { id: t, x: cx + outerR * Math.cos(angle), y: cy + outerR * Math.sin(angle) };
    });

    const edges = projects.flatMap((p) => p.stack.map((t) => ({ from: p.slug, to: t })));

    return { projectNodes, techNodes, edges };
}