"use client";

import type { ProjectView as Project } from "@/content/ProjectView";
import { DetailCard } from "@/components/shared/DetailCard";
import { MapOverlay } from "@/components/sections/projects/map/MapOverlay";
import { OverflowList } from "@/components/sections/projects/map/OverflowList";
import { ProjectMapNode } from "@/components/sections/projects/map/ProjectMapNode";
import { ClusterNode } from "@/components/sections/projects/map/ClusterNode";
import { CenterHex } from "@/components/sections/projects/map/CenterHex";
import { MapFrame } from "@/components/sections/projects/map/MapFrame";
import { ClusterLinks, NodeLinks } from "@/components/sections/projects/map/LinkLines";
import { useMapSelection } from "@/hooks/useMapSelection";
import { getClusterPositions, layoutCluster, keyFor, type PositionedNode } from "@/lib/map/layout";

type DesktopMapProps = {
    projects: Project[];
    selectedSlug: string | null;
    onSelectSlug: (slug: string | null) => void;
};

export const DesktopMap = ({ projects, selectedSlug, onSelectSlug }: DesktopMapProps) => {
    const {
        hovered, setHovered,
        overflowClusterId,
        closeRef,
        closeOverlay,
        openProject,
        openOverflow,
    } = useMapSelection(selectedSlug, onSelectSlug);

    const clusterPositions = getClusterPositions();
    const projectPositions = clusterPositions.flatMap((cluster) =>
        layoutCluster(cluster, projects.filter((p) => p.context === cluster.id))
    );

    const selected = selectedSlug
        ? projects.find((p) => p.slug === selectedSlug) ?? null
        : null;

    const overflowCluster = overflowClusterId
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

    function isActive(key: string) {
        return hovered === key || (selected !== null && selected.slug === key);
    }

    return (
        <div className="surface-card relative hidden overflow-hidden md:block">
            <MapFrame projectCount={projects.length} />

            <svg
                viewBox="0 0 1000 640"
                className="relative block w-full"
                role="group"
                aria-label="Mapa de proyectos agrupados por contexto"
            >
                <ClusterLinks clusters={clusterPositions} />
                <NodeLinks positions={projectPositions} isActive={isActive} />

                {clusterPositions.map((c) => (
                    <ClusterNode key={c.id} cluster={c} />
                ))}

                <CenterHex />

                {projectPositions.map((p) => {
                    const key = keyFor(p);
                    return (
                        <ProjectMapNode
                            key={key}
                            positioned={p}
                            isActive={isActive(key)}
                            onHover={setHovered}
                            onActivate={(e) => {
                                const origin = e.currentTarget;
                                if (p.node.kind === "project") {
                                    openProject(p.node.project.slug, origin);
                                } else {
                                    openOverflow(p.cluster.id, origin);
                                }
                            }}
                        />
                    );
                })}
            </svg>

            {selected ? (
                <MapOverlay
                    ariaLabel={`Detalle del proyecto ${selected.slug}`}
                    closeRef={closeRef}
                    onClose={closeOverlay}
                    position="absolute"
                    maxWidthClassName={selected.featured ? "max-w-5xl" : "max-w-xl"}
                >
                    <DetailCard project={selected} />
                </MapOverlay>
            ) : null}

            {overflowCluster ? (
                <OverflowList
                    cluster={overflowCluster}
                    hidden={overflowHidden}
                    closeRef={closeRef}
                    onClose={closeOverlay}
                    onSelectProject={(slug) => {
                        closeOverlay();
                        onSelectSlug(slug);
                    }}
                />
            ) : null}
        </div>
    );
};