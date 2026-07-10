export function MapFrame({ projectCount }: { projectCount: number }) {
    return (
        <>
            <div className="blueprint-grid absolute inset-0 opacity-60 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

            <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/60" />
            <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-primary/60" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-primary/60" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-primary/60" />

            <div className="pointer-events-none absolute left-6 top-6 font-mono-tech text-[10px] uppercase tracking-widest text-primary">
                fig.02 — projects / map
            </div>
            <div className="pointer-events-none absolute right-6 top-6 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                {projectCount.toString().padStart(2, "0")} · nodos
            </div>
        </>
    );
}