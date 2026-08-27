interface Props {
    eyebrow: string;
    title: string;
    description?: string;
    align?: "left" | "center";
    index?: string;
}

export const SectionHeader = ({ eyebrow, title, description, align = "left", index }: Props) => {
    const isCenter = align === "center";

    return (
        <div className={`flex gap-5 ${isCenter ? "mx-auto max-w-2xl flex-col items-center text-center" : "max-w-2xl"}`}>
            {!isCenter && (
                <div className="hidden shrink-0 flex-col items-center gap-3 pt-1 sm:flex">
                    {index && (
                        <span className="font-mono-tech text-[10px] text-muted-foreground/50">{index}</span>
                    )}
                    <span className="w-px flex-1 bg-border" />
                    <span
                        className="font-mono-tech text-[10.5px] uppercase tracking-[0.2em] text-accent"
                        style={{ writingMode: "vertical-rl" }}
                    >
                        {eyebrow}
                    </span>
                    <span className="w-px flex-1 bg-border" />
                </div>
            )}

            <div className="min-w-0">
                {(isCenter || true) && (
                    <div className={`mb-3 flex items-center gap-2 font-mono-tech text-[10.5px] uppercase tracking-[0.15em] text-accent sm:hidden ${isCenter ? "justify-center" : ""}`}>
                        {index && <span className="text-muted-foreground/50">{index}</span>}
                        {eyebrow}
                    </div>
                )}

                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-[40px]">
                    {title}
                </h2>

                {description ? (
                    <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    )
}