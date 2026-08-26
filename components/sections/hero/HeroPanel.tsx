'use client';

import { useTranslation } from "@/lib/i18n/context";

export const HeroPanel = () => {
    const { t } = useTranslation();

    const rows = [
        { label: t.hero.panel.availability, value: t.hero.panel.availabilityValue, accent: true },
        { label: t.hero.panel.response, value: t.hero.panel.responseValue },
        { label: t.hero.panel.shipped, value: t.hero.panel.shippedValue },
    ];

    const stack = ["Python", "Java", "TypeScript", "Next.js", "PostgreSQL"];

    return (
        <aside className="rounded-md border border-border bg-surface/60 px-6 py-6 font-mono-tech backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                — {t.hero.panel.title}
            </p>
            <dl className="mt-4 space-y-4">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex flex-col gap-1 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                    >
                        <dt className="text-xs text-muted-foreground">{row.label}</dt>
                        <dd className={`text-sm leading-snug text-accent`}>
                            {row.value}
                        </dd>
                    </div>
                ))}
            </dl>

            <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
                — {t.hero.panel.stack}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {stack.map((item) => (
                    <span
                        key={item}
                        className="rounded border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </aside>
    )
}