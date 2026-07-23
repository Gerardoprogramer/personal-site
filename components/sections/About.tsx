import { AboutText } from "./about/AboutText ";
import { CodeSnippetCard } from "./about/CodeSnippetCard";
import { Reveal } from "../shared/Reveal";

export const About = () => {
    return (
        <section
            id="sobre-mi"
            className="relative border-y border-border bg-surface/40 py-24"
        >
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <Reveal>
                    <AboutText />
                </Reveal>
                <Reveal delay={120} className="lg:pt-14 min-w-0">
                    <CodeSnippetCard />
                </Reveal>
            </div>
        </section>
    )
}