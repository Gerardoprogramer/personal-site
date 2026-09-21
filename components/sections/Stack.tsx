"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function Stack() {
  const { language } = useTranslation();
  const es = language === "es";
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
      title: es ? "Datos y herramientas" : "Data and tooling",
      items: "PostgreSQL · Prisma · Docker · Git · GitHub Actions · Playwright",
    },
  ];
  return (
    <section id="stack" className="section-shell relative isolate pb-20">
      <BackgroundLetter letter="R" size="compact" />
      <h2 className="eyebrow mb-6 text-muted-foreground">
        {es ? "Herramientas de trabajo" : "Tools I work with"}
      </h2>
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
