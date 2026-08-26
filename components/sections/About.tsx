import { AboutText } from "./about/AboutText ";
import { Reveal } from "../shared/Reveal";
import { BackgroundLetter } from "../shared/BackgroundLetter";

export const About = () => {
    return (
        <section
            id="sobre-mi"
            className="relative border-y border-border bg-surface/40 py-24"
        >
            <BackgroundLetter letter="E" />
            <div className="mx-auto max-w-6xl px-6">
                <Reveal>
                    <AboutText />
                </Reveal>
            </div>
        </section>
    )
}