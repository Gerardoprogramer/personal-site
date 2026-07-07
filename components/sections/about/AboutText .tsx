"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { useTranslation } from "@/lib/i18n/context";

export const AboutText = () => {
    const { t } = useTranslation();

    return (
        <div>
            <SectionHeader eyebrow={t.sobreMi.eyebrow} title={t.sobreMi.title} />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>{t.sobreMi.paragraph1}</p>
                <p>{t.sobreMi.paragraph2}</p>
                <p>
                    {t.sobreMi.paragraph3_prefix}{" "}
                    <span className="text-foreground">{t.sobreMi.empleoFijo}</span>{" "}
                    {t.sobreMi.paragraph3_middle}{" "}
                    <span className="text-foreground">{t.sobreMi.proyectosFreelance}</span>{" "}
                    {t.sobreMi.paragraph3_suffix}
                </p>
            </div>
        </div>
    );
};