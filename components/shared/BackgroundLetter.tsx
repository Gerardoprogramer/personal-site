interface BackgroundLetterProps {
    letter: string;
    side?: "left" | "right";
}

export const BackgroundLetter = ({ letter, side = "right" }: BackgroundLetterProps) => {
    const positionClass = side === "right" ? "-right-16" : "-left-16";

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute ${positionClass} top-1/2 hidden -translate-y-1/2 select-none font-display text-[520px] italic leading-none text-foreground/[0.035] lg:block`}
        >
            {letter}
        </div>
    )
}