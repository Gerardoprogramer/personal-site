type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Paginación de proyectos"
            className="mt-10 flex items-center justify-center gap-1 font-mono-tech text-[11px] uppercase tracking-widest"
        >
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
                <span aria-hidden="true">[</span>prev<span aria-hidden="true">]</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                    key={n}
                    type="button"
                    aria-current={n === page ? "page" : undefined}
                    onClick={() => onPageChange(n)}
                    className={`min-w-9 border px-3 py-1.5 transition-colors ${n === page
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                >
                    {n.toString().padStart(2, "0")}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
                <span aria-hidden="true">[</span>next<span aria-hidden="true">]</span>
            </button>
        </nav>
    );
};