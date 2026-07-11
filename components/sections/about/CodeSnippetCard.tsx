"use client";

import { useTranslation } from "@/lib/i18n/context";

const codeSnippet = `# what.i.do
def build(problem):
    domain    = model(problem)   # DDD primero
    contracts = clarify(domain)  # interfaces claras
    code      = implement(contracts)
    return ship(code, with_tests=True)`;

export const CodeSnippetCard = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="surface-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                        <span className="size-2.5 rounded-full bg-primary/70" />
                    </div>
                    <span className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                        how_i_work.py
                    </span>
                </div>
                <pre className="overflow-x-auto p-6 font-mono-tech text-[13px] leading-relaxed text-muted-foreground">
                    <code>
                        {codeSnippet.split("\n").map((line, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="w-4 shrink-0 text-right text-muted-foreground/40">
                                    {i + 1}
                                </span>
                                <span
                                    className={
                                        line.trim().startsWith("#")
                                            ? "text-muted-foreground/80"
                                            : line.includes("def ") || line.includes("return")
                                                ? "text-primary"
                                                : "text-foreground"
                                    }
                                >
                                    {line || " "}
                                </span>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>
            <p className="mt-4 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground">
                {t.sobreMi.footnote}
            </p>
        </>
    );
};