import { ProjectView as Project } from "@/content/ProjectView";

export const MobileMap = ({ projects }: { projects: Project[] }) => {
    return (
        <div className="space-y-4 md:hidden">
            {CLUSTERS.map((c) => {
                const list = projects.filter((p) => p.context === c.id);
                return (
                    <details
                        key={c.id}
                        className="surface-card overflow-hidden"
                        open
                    >
                        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-mono-tech text-[11px] uppercase tracking-widest text-primary">
                            <span>// {c.label}</span>
                            <span className="text-muted-foreground">
                                {list.length.toString().padStart(2, "0")}
                            </span>
                        </summary>
                        <div className="space-y-3 border-t border-border p-4">
                            {list.map((p) => (
                                <button
                                    key={p.slug}
                                    type="button"
                                    onClick={(e) => {
                                        lastFocusRef.current = e.currentTarget;
                                        setSelected(p);
                                    }}
                                    className="w-full border border-border bg-surface-2/50 px-3 py-2 text-left font-mono-tech text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                                    aria-label={`Abrir proyecto ${p.title}`}
                                >
                                    <span className="text-primary">[</span> {p.title}{" "}
                                    <span className="text-primary">]</span>
                                </button>
                            ))}
                        </div>
                    </details>
                );
            })}

            {selected ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Detalle del proyecto ${selected.title}`}
                    style={{ animation: "map-fade-in 180ms ease-out both" }}
                >
                    <div
                        className="max-h-full w-full max-w-lg overflow-y-auto"
                        style={{ animation: "map-materialize 260ms cubic-bezier(0.16,1,0.3,1) both" }}
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={() => {
                                setSelected(null);
                                lastFocusRef.current?.focus();
                            }}
                            className="mb-3 inline-flex items-center gap-2 border-b border-border pb-0.5 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                            ← volver al mapa
                        </button>
                        <DetailCard project={selected} />
                    </div>
                </div>
            ) : null}
        </div>
    )
}
