'use client';

import { useTranslation } from "@/lib/i18n/context";

export const HeroHeading = () => {
    const { t } = useTranslation();

    return (
        <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[64px]">
            {t.hero.title}{" "}
            <span className="relative whitespace-nowrap text-primary">
                {t.hero.subtitle}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 200 10"
                    className="absolute -bottom-3 left-0 w-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M2 6 Q 50 2, 100 5 T 198 4"
                        stroke="var(--color-primary)"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="220"
                        style={{
                            strokeDashoffset: 220,
                            animation: "underline-draw 0.9s cubic-bezier(0.65,0,0.35,1) 0.5s forwards",
                            filter: "drop-shadow(0 0 6px var(--color-primary))",
                        }}
                    />
                </svg>
            </span>
            .
        </h1>
    )
}