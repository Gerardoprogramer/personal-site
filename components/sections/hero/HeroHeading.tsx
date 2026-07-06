
export const HeroHeading = () => {
    return (
        <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[64px]">
            Diseño y construyo software que resiste{" "}
            <span className="relative whitespace-nowrap text-primary text-glow">
                producción
                <svg
                    aria-hidden="true"
                    viewBox="0 0 200 8"
                    className="absolute -bottom-2 left-0 w-full"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M2 5 Q 50 1, 100 4 T 198 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </span>
            .
        </h1>
    )
}
