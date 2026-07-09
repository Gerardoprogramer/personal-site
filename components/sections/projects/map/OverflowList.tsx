import { MapOverlay } from "./MapOverlay";
import type { ClusterPos } from "@/lib/map/layout";
import type { ProjectView as Project } from "@/content/ProjectView";

type Props = {
    cluster: ClusterPos;
    hidden: Project[];
    closeRef: React.RefObject<HTMLButtonElement | null>;
    onClose: () => void;
    onSelectProject: (slug: string) => void;
};

export function OverflowList({ cluster, hidden, closeRef, onClose, onSelectProject }: Props) {
    return (
        <MapOverlay
            ariaLabel={`Más proyectos de ${cluster.label}`}
            closeRef={closeRef}
            onClose={onClose}
            position="absolute"
            maxWidthClassName="max-w-2xl"
        >
            <div className="surface-card border border-primary/40 p-6">
                <div className="mb-4 font-mono-tech text-[11px] uppercase tracking-widest text-primary">
                    // {cluster.label.toUpperCase()} — proyectos adicionales
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {hidden.map((project) => (
                        <button
                            key={project.slug}
                            type="button"
                            onClick={() => onSelectProject(project.slug)}
                            className="border border-border bg-(--color-surface-2) px-4 py-3 text-left font-mono-tech text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            {project.title}
                        </button>
                    ))}
                </div>
            </div>
        </MapOverlay>
    );
}