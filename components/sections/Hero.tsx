import { HeroHeading } from "./hero/HeroHeading";
import { HeroDescription } from "./hero/HeroDescription";
import { HeroActions } from "./hero/HeroActions";
import { HeroPanel } from "./hero/HeroPanel";
import { BackgroundLetter } from "../shared/BackgroundLetter";

export const Hero = () => {
    return (
        <section
            id="top"
            className="relative overflow-hidden pt-24 pb-24 md:pt-32 md:pb-32"
        >
            <div
                aria-hidden="true"
                className="blueprint-grid pointer-events-none absolute inset-0 opacity-50 mask-[radial-gradient(ellipse_at_top,black_20%,transparent_75%)]"
            />
            <BackgroundLetter letter="G" />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:px-10 lg:grid-cols-[1fr_300px] lg:px-16">
                <div className="max-w-4xl">
                    <HeroHeading />
                    <HeroDescription />
                    <HeroActions />
                </div>
                <HeroPanel />
            </div>
        </section>
    )
}