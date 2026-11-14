"use client";

import { useTranslation } from "@/lib/i18n/context";

// "How I work with AI", shown in Libra's case study. Figures checked on
// 2026-11-14 against Libra's history (ed3c3bf): 45 of 137 non-merge commits
// carry a Co-authored-by trailer from Claude or GitHub Copilot. The three
// write scripts of the example were fixed in d710d4a, 2c6a201 and eb81cf5.
const copy = {
  es: {
    eyebrow: "Proceso",
    title: "Cómo trabajo con IA",
    intro:
      "Uso asistentes de IA para programar (Claude y GitHub Copilot) y lo declaro: al menos 45 de 137 commits de Libra llevan coautoría de IA. Lo que me importa es que cada cambio se pueda verificar:",
    steps: [
      [
        "Contexto versionado",
        "AGENTS.md y CLAUDE.md viven en el repositorio.",
      ],
      [
        "Guardas",
        "Los scripts editoriales que escriben son dry-run por defecto, piden --apply y, en bases remotas, --confirm-database con el destino enmascarado, igual que las migraciones. Tienen pruebas.",
      ],
      [
        "Verificación y revisión",
        "Cada PR pasa por lint, tipos, formato y pruebas, incluida la integración con Postgres desechable, y la reviso antes de fusionar.",
      ],
    ],
    example:
      "Un ejemplo: antes de publicar este caso de estudio hice auditar cada afirmación contra el código. Descubrimos que tres scripts de escritura no cumplían lo que iba a afirmar. Corregí el código, no el texto, y añadí pruebas.",
  },
  en: {
    eyebrow: "Process",
    title: "How I work with AI",
    intro:
      "I use AI coding assistants (Claude and GitHub Copilot) and I disclose it: at least 45 of Libra’s 137 commits are co-authored by AI. What matters to me is that every change can be verified:",
    steps: [
      [
        "Versioned context",
        "AGENTS.md and CLAUDE.md live in the repository.",
      ],
      [
        "Guards",
        "Editorial scripts that write are dry runs by default, require --apply and, on remote databases, --confirm-database with the target masked, just like migrations. They have tests.",
      ],
      [
        "Verification and review",
        "Every PR goes through lint, types, formatting and tests, including integration against a disposable Postgres, and I review it before merging.",
      ],
    ],
    example:
      "One example: before publishing this case study, I had every claim audited against the code. We found that three write scripts did not do what I was about to claim. I fixed the code, not the text, and added tests.",
  },
};

export function AiPractice() {
  const { language } = useTranslation();
  const text = copy[language];
  return (
    <section
      aria-labelledby="ai-practice-title"
      className="mt-16 rounded-xl border border-[#aebce6]/20 bg-[#141927] p-6 sm:p-10"
    >
      <p className="eyebrow mb-4 text-[#aebce6]">{text.eyebrow}</p>
      <h2
        id="ai-practice-title"
        className="font-display text-3xl sm:text-4xl"
      >
        {text.title}
      </h2>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {text.intro}
      </p>
      <ol className="mt-8 grid gap-7 md:grid-cols-3">
        {text.steps.map(([title, body], index) => (
          <li key={title} className="border-t border-[#aebce6]/30 pt-5">
            <span className="font-mono-tech text-xs text-[#aebce6]">
              0{index + 1}
            </span>
            <h3 className="mb-3 mt-4 font-medium">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-3xl border-t border-[#aebce6]/20 pt-5 text-sm leading-relaxed text-foreground">
        {text.example}
      </p>
    </section>
  );
}
