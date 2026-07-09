"use client";

import type { ProjectView as Project } from "@/content/ProjectView";
import { DetailCard } from "@/components/shared/DetailCard";
import { useMapSelection } from "@/hooks/useMapSelection";
import { CLUSTERS } from "@/lib/map/layout";
import { MapOverlay } from "./map/MapOverlay";


type MobileMapProps = {
    projects: Project[];
    selectedSlug: string | null;
    onSelectSlug: (slug: string | null) => void;
};

export const MobileMap = ({ projects, selectedSlug, onSelectSlug }: MobileMapProps) => {

    const {
        closeRef,
        closeOverlay,
        openProject 
    } = useMapSelection(selectedSlug, onSelectSlug);

    const selected = selectedSlug
        ? projects.find((p) => p.slug === selectedSlug) ?? null
        : null;


    return (
        <div className="space-y-4 md:hidden">
            {CLUSTERS.map((c) => {
                const list = projects.filter((p) => p.context === c.id);
                return (
                    <details
                        key={c.id}
                        className="surface-card overflow-hidden"
                        open
                    >
                        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-mono-tech text-[11px] uppercase tracking-widest text-primary">
                            <span>// {c.label}</span>
                            <span className="text-muted-foreground">
                                {list.length.toString().padStart(2, "0")}
                            </span>
                        </summary>
                        <div className="space-y-3 border-t border-border p-4">
                            {list.map((p) => (
                                <button
                                    key={p.slug}
                                    type="button"
                                    onClick={(e) => openProject(p.slug, e.currentTarget)}
                                    className="w-full border border-border bg-surface-2/50 px-3 py-2 text-left font-mono-tech text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                                    aria-label={`Abrir proyecto ${p.title}`}
                                >
                                    <span className="text-primary">[</span> {p.title}{" "}
                                    <span className="text-primary">]</span>
                                </button>
                            ))}
                        </div>
                    </details>
                );
            })}

            {selected ? (
                <MapOverlay
                    ariaLabel={`Detalle del proyecto ${selected.title}`}
                    closeRef={closeRef}
                    onClose={closeOverlay}
                    position="fixed"
                    maxWidthClassName="max-w-lg"
                >
                    <DetailCard project={selected} />
                </MapOverlay>
            ) : null}
        </div>
    )
}
