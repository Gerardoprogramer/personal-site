interface Props {
    eyebrow: string;
    title: string;
    description?: string;
    align?: "left" | "center";
}

export const SectionHeader = ({ eyebrow, title, description, align = "left", }: Props) => {
    return (
        <div
            className={
                align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
            }
        >
            <div
                className={`flex items-center gap-3 font-mono-tech text-[11px] uppercase tracking-widest text-primary ${align === "center" ? "justify-center" : ""
                    }`}
            >
                <span className="h-px w-6 bg-primary" />
                {eyebrow}
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-[40px]">
                {title}
            </h2>
            {description ? (
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                    {description}
                </p>
            ) : null}
        </div>
    )
}
