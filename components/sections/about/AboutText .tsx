"use client";

import { useTranslation } from "@/lib/i18n/context";

export const AboutText = () => {
    const { t } = useTranslation();

    return (
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            {/* bookmark ribbon */}
            <span
                aria-hidden
                className="absolute -left-6 top-1 hidden h-[calc(100%-8px)] w-px bg-border lg:block"
            >
                <span className="absolute -left-0.75 top-0 size-1.75 rounded-full bg-primary/85" />
            </span>

            <div>
                <p className="mb-8 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground">
                    {t.sobreMi.pageLabel}
                </p>

                <div className="max-w-[58ch] space-y-7 text-[21px] leading-[1.75] text-foreground">
                    <p className="first-letter:float-left first-letter:pr-2 first-letter:pt-1 first-letter:font-display first-letter:text-6xl first-letter:italic first-letter:leading-[0.8]">
                        {t.sobreMi.paragraph1}
                    </p>

                    <p>
                        {t.sobreMi.paragraph2Prefix}{" "}
                        <span className="border-b border-primary/50">
                            {t.sobreMi.paragraph2Anchor}
                        </span>
                        {t.sobreMi.paragraph2Suffix}
                    </p>

                    <p>{t.sobreMi.paragraph3}</p>
                    <p>{t.sobreMi.paragraph4}</p>
                </div>

                <div className="mt-14 flex flex-wrap gap-7 border-t border-border pt-8 font-mono-tech text-[13px] text-muted-foreground">
                    <span>
                        <strong className="font-medium text-foreground">{t.sobreMi.metaLocationLabel}</strong>
                        {" — "}{t.sobreMi.metaLocation}
                    </span>
                    <span>
                        <strong className="font-medium text-foreground">{t.sobreMi.metaFormatLabel}</strong>
                        {" — "}{t.sobreMi.metaFormat}
                    </span>
                    <span>
                        <strong className="font-medium text-foreground">{t.sobreMi.metaStatusLabel}</strong>
                        {" — "}{t.sobreMi.metaStatus}
                    </span>
                </div>
            </div>

            {/* margin note — hidden on small screens, like a footnote */}
            <div className="hidden lg:block lg:pt-24">
                <div className="relative max-w-[26ch] pl-4 font-mono-tech text-xs leading-relaxed text-muted-foreground">
                    <span
                        aria-hidden
                        className="absolute left-0 top-1.75 h-px w-2.5 bg-primary/70"
                    />
                    <span className="mb-1 block tracking-wide text-primary">
                        {t.sobreMi.noteTag}
                    </span>
                    {t.sobreMi.noteText}
                </div>
            </div>
        </div>
    );
};