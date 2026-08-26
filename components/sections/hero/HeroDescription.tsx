'use client';

import { useTranslation } from "@/lib/i18n/context";

export const HeroDescription = () => {
    const { t } = useTranslation();

    return (
        <>
            <p className="mt-8 max-w-[56ch] text-pretty text-lg leading-relaxed text-foreground/80 sm:text-xl">
                {t.hero.description}
            </p>
        </>
    )
}