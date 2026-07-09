import { DesktopMap } from "./DesktopMap"
import type { ProjectView as Project } from "@/content/ProjectView";


export const ProjectsMap = ({ projects }: { projects: Project [] }) => {
    return (
        <div className="relative">
            {/* Desktop: SVG tree */}
            <DesktopMap projects={projects}/>


            {/* Mobile: collapsible clusters */}

        </div>
    )
}
