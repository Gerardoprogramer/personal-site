'use client'

import { SectionHeader } from "../shared/SectionHeader";
import { stackGroups, ICONS } from "@/content/stack";
import { useTranslation } from "@/lib/i18n/context";

export const Stack = () => {
    const { t } = useTranslation();

    return (
        <section id="stack" className="py-24">
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeader
                    eyebrow={t.Stack.Header.eyebrow}
                    title={t.Stack.Header.title}
                    description={t.Stack.Header.description}
                />

                <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stackGroups(t).map((group) => (
                        <div
                            key={group.id}
                            className={`surface-card p-6 ${group.secondary ? "opacity-70" : ""}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                                    {group.label}
                                </div>
                                <div className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                                    {group.items.length.toString().padStart(2, "0")}
                                </div>
                            </div>
                            <ul className="mt-5 space-y-2.5">
                                {group.items.map((item) => {
                                    const Icon = ICONS[item];
                                    return (
                                        <li
                                            key={item}
                                            className="flex items-center gap-3 text-sm text-foreground"
                                        >
                                            {Icon ? (
                                                <Icon
                                                    aria-hidden="true"
                                                    className={`size-4 shrink-0 ${group.secondary
                                                        ? "text-muted-foreground/70"
                                                        : "text-primary"
                                                        }`}
                                                />
                                            ) : (
                                                <span
                                                    aria-hidden="true"
                                                    className={`size-1 ${group.secondary
                                                        ? "bg-muted-foreground/60"
                                                        : "bg-primary"
                                                        }`}
                                                />
                                            )}
                                            <span>{item}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
