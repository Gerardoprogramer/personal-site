import { AboutText } from "./about/AboutText ";
import { CodeSnippetCard } from "./about/CodeSnippetCard";

export const About = () => {
    return (
        <section
            id="sobre-mi"
            className="relative border-y border-border bg-surface/40 py-24"
        >
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <AboutText />
                <div className="lg:pt-14">
                    <CodeSnippetCard />
                </div>
            </div>
        </section>
    )
}
