"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function Services() {
  const { language } = useTranslation();
  const es = language === "es";
  const items = es
    ? [
        [
          "Aplicaciones a medida",
          "Sistemas de gestión, plataformas web e integración de APIs, desde las reglas del negocio hasta la interfaz.",
        ],
        [
          "Sitios con identidad",
          "Landings y experiencias web con atención a la composición, la navegación, el rendimiento y los dispositivos móviles.",
        ],
        [
          "Evolución de sistemas",
          "Nuevas funcionalidades, corrección de errores y migraciones con cambios comprobables y documentación útil.",
        ],
      ]
    : [
        [
          "Custom applications",
          "Management systems, web platforms and API integrations, from business rules to the interface.",
        ],
        [
          "Websites with identity",
          "Landing pages and web experiences with attention to composition, navigation, performance and mobile devices.",
        ],
        [
          "Evolving existing systems",
          "New features, bug fixes and migrations with verifiable changes and useful documentation.",
        ],
      ];
  return (
    <section
      id="servicios"
      className="relative isolate border-y border-border bg-surface/50 py-16"
    >
      <BackgroundLetter letter="D" side="left" />
      <div className="section-shell">
        <p className="eyebrow mb-4">
          04 / {es ? "Cómo puedo aportar" : "How I can help"}
        </p>
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          {es
            ? "De una idea a algo que puedas usar."
            : "From an idea to something you can use."}
        </h2>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {items.map(([title, body], index) => (
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
