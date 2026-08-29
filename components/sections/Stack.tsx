'use client'

import { SectionHeader } from "../shared/SectionHeader";
import { Reveal } from "../shared/Reveal";
import { stackGroups } from "@/content/stack";
import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "../shared/BackgroundLetter";
import { MetroMap } from "@/components/sections/stack/MetroMap";

export const Stack = () => {
    const { t } = useTranslation();

    return (
        <section id="stack" className="relative overflow-hidden py-24">
            <BackgroundLetter letter="R" />
            <div className="mx-auto max-w-6xl px-6">
                <Reveal>
                    <SectionHeader
                        eyebrow={t.Stack.Header.eyebrow.replace("// ", "")}
                        title={t.Stack.Header.title}
                        description={t.Stack.Header.description}
                        index="03"
                    />
                </Reveal>

                <Reveal delay={120}>
                    <div className="mt-14">
                        <MetroMap groups={stackGroups(t)} />
                    </div>
                </Reveal>
            </div>
        </section>
    )
}