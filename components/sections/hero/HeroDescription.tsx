'use client';

import { useTranslation } from "@/lib/i18n/context";

export const HeroDescription = () => {
    const { t } = useTranslation();

    return (
        <>
            <p className="mt-8 max-w-[54ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t.hero.description}
            </p>
        </>
    )
}
