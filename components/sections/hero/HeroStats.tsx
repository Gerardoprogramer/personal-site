export const HeroStats = () => {
    const stats = [
        { label: "stack", value: "Python · TS" },
        { label: "foco", value: "Full Stack" },
        { label: "base", value: "Costa Rica" },
    ];

    return (
        <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
                <div key={s.label}>
                    <dt className="flex items-center gap-1 font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                        <span className="text-primary/50">[</span>
                        {s.label}
                        <span className="text-primary/50">]</span>
                    </dt>
                    <dd className="mt-2 font-display text-lg font-semibold">
                        {s.value}
                    </dd>
                </div>
            ))}
        </dl>
    )
}