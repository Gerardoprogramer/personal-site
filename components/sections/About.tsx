"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function About() {
  const { t } = useTranslation();
  return (
    <section
      id="sobre-mi"
      className="section-shell relative isolate grid gap-10 py-20 md:grid-cols-[1fr_1.4fr]"
    >
      <BackgroundLetter letter="A" side="left" />
      <div>
        <p className="eyebrow mb-4">03 / {t.about.eyebrow}</p>
        <h2 className="font-display text-4xl tracking-tight">
          {t.about.titleLine1}
          <br />
          <span className="text-muted-foreground">
            {t.about.titleLine2}
          </span>
        </h2>
      </div>
      <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
        {t.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
