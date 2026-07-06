import { HeroMeta } from "./hero/HeroMeta";
import { HeroHeading } from "./hero/HeroHeading";
import { HeroDescription } from "./hero/HeroDescription";
import { HeroActions } from "./hero/HeroActions";
import { HeroStats } from "./hero/HeroStats";
import { ArchDiagram } from "./hero/ArchDiagram";

export const Hero = () => {
    return (
        <section
            id="top"
            className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
        >
            <div
                aria-hidden="true"
                className="blueprint-grid pointer-events-none absolute inset-0 opacity-100 mask-[radial-gradient(ellipse_at_top,black_20%,transparent_75%)]"
            />

            <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
                <div>
                    <HeroMeta />
                    <HeroHeading />
                    <HeroDescription />
                    <HeroActions />
                    <HeroStats />
                </div>

                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <ArchDiagram />
                </div>
            </div>
        </section>
    )
}
