import { DesktopMap } from "./DesktopMap"
import type { ProjectView as Project } from "@/content/ProjectView";

type ProjectsMapProps = {
    projects: Project[];
    selectedSlug: string | null;
    onSelectSlug: (slug: string | null) => void;
};

export const ProjectsMap = ({ projects, selectedSlug, onSelectSlug }: ProjectsMapProps) => {
    return (
        <div className="relative">
            {/* Desktop: SVG tree */}
            <DesktopMap
                projects={projects}
                selectedSlug={selectedSlug}
                onSelectSlug={onSelectSlug}
            />


            {/* Mobile: collapsible clusters */}

        </div>
    )
}
