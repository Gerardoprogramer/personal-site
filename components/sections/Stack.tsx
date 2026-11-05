"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function Stack() {
  const { t } = useTranslation();
  const groups = [
    {
      title: "Frontend",
      items: "TypeScript · React · Next.js · Tailwind CSS · Vue.js",
    },
    {
      title: "Backend",
      items:
        "Java · Spring Boot · Node.js · NestJS · Python · FastAPI · Django",
    },
    {
      title: t.stack.data,
      items: "PostgreSQL · Prisma · Docker · Git · GitHub Actions · Playwright",
    },
  ];
  return (
    <section id="stack" className="section-shell relative isolate pb-20">
      <BackgroundLetter letter="R" size="compact" />
      <SectionHeader
        index="04"
        size="md"
        eyebrow={t.stack.eyebrow}
        title={t.stack.title}
        className="mb-6"
      />
      <div className="grid gap-6 border-y border-border py-7 md:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-sm font-medium">{group.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              {group.items}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
