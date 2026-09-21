"use client";

import { useTranslation } from "@/lib/i18n/context";
import { BackgroundLetter } from "@/components/shared/BackgroundLetter";

export function About() {
  const { language } = useTranslation();
  const es = language === "es";
  return (
    <section
      id="sobre-mi"
      className="section-shell relative isolate grid gap-10 py-20 md:grid-cols-[1fr_1.4fr]"
    >
      <BackgroundLetter letter="A" side="left" />
      <div>
        <p className="eyebrow mb-4">03 / {es ? "Sobre mí" : "About me"}</p>
        <h2 className="font-display text-4xl tracking-tight">
          {es ? "Entender primero." : "Understand first."}
          <br />
          <span className="text-muted-foreground">
            {es ? "Construir con criterio." : "Build with purpose."}
          </span>
        </h2>
      </div>
      <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
        <p>
          {es
            ? "Mi formación en Informática Empresarial conecta dos cosas que me interesan: cómo funciona un negocio y cómo el software puede ayudarlo. Me gusta seguir el problema completo, desde lo que necesita una persona hasta los datos y las reglas que sostienen la solución."
            : "My background in Business Informatics connects two things I care about: how a business works and how software can help. I like following the whole problem, from a person’s needs to the data and rules that support the solution."}
        </p>
        <p>
          {es
            ? "Trabajo desde Liberia, Costa Rica. Leo bastante, disfruto pulir las interfaces y presto atención a lo que sucede cuando una operación falla. Busco aportar esa mirada en un equipo o en un proyecto a medida."
            : "I work from Liberia, Costa Rica. I read a lot, enjoy refining interfaces and pay attention to what happens when an operation fails. I’m looking to bring that approach to a team or a custom project."}
        </p>
      </div>
    </section>
  );
}
