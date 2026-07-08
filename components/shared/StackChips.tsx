
export const StackChips = ({ stack }: { stack: string[] }) => {
    return (
        <ul className="flex flex-wrap gap-1.5">
            {stack.map((s) => (
                <li
                    key={s}
                    className="rounded-sm border border-border bg-surface-2 px-2 py-0.5 font-mono-tech text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                    {s}
                </li>
            ))}
        </ul>
    )
}
