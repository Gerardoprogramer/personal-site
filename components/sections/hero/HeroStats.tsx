
export const HeroStats = () => {
    return (
        <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                    stack
                </dt>
                <dd className="mt-2 font-display text-lg font-semibold">
                    Python · TS
                </dd>
            </div>
            <div>
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                    foco
                </dt>
                <dd className="mt-2 font-display text-lg font-semibold">
                    Backend · Full Stack
                </dd>
            </div>
            <div>
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                    base
                </dt>
                <dd className="mt-2 font-display text-lg font-semibold">
                    Costa Rica
                </dd>
            </div>
        </dl>
    )
}
