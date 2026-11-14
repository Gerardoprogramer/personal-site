"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";
import { SectionHeader } from "@/components/shared/SectionHeader";

// Every technology from the previous Frontend / Backend / Data groups is kept:
// the first group lists what runs in shipped projects, the second the rest.
const PRODUCTION = [
  "TypeScript",
  "Next.js",
  "React",
  "PostgreSQL",
  "NestJS",
  "Spring Boot",
];

const WORKED_WITH = [
  "Java",
  "Node.js",
  "Python",
  "FastAPI",
  "Django",
  "Vue.js",
  "Tailwind CSS",
  "Prisma",
  "Docker",
  "Git",
  "GitHub Actions",
  "Playwright",
];

export function Stack() {
  const { t } = useTranslation();
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
      <div className="grid gap-8 border-y border-border py-7 md:grid-cols-2 md:gap-12">
        <div>
          <h3 className="mb-4 text-sm font-medium">{t.stack.production}</h3>
          <ul className="flex flex-wrap gap-2">
            {PRODUCTION.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-foreground/30 px-3 py-1.5 text-sm text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-medium">{t.stack.workedWith}</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            {WORKED_WITH.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
