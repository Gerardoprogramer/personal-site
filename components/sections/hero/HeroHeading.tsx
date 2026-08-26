'use client';

import { useTranslation } from "@/lib/i18n/context";

export const HeroHeading = () => {
    const { t } = useTranslation();

    return (
        <h1 className="font-display text-balance text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-[68px] lg:text-[76px]">
            {t.hero.title}{" "}
            <em className="font-normal italic text-accent">
                {t.hero.subtitle}
            </em>
        </h1>
    )
}