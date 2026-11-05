"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function Services() {
  const { t } = useTranslation();
  return (
    <section
      id="servicios"
      className="relative isolate border-y border-border bg-surface/50 py-16"
    >
      <BackgroundLetter letter="D" side="left" />
      <div className="section-shell">
        <SectionHeader
          index="05"
          size="md"
          eyebrow={t.services.eyebrow}
          title={t.services.title}
        />
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {t.services.items.map(({ title, body }, index) => (
            <div key={title}>
              <span className="font-mono-tech text-xs text-accent">
                0{index + 1}
              </span>
              <h3 className="mb-3 mt-4 text-lg">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
