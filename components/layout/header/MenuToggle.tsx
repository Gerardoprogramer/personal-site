'use client';

interface MenuToggleProps {
    open: boolean;
    onToggle: () => void;
}

export const MenuToggle = ({ open, onToggle }: MenuToggleProps) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "cerrar menú" : "abrir menú"}
            className="relative flex size-8 shrink-0 items-center justify-center text-foreground"
        >
            <span className={`absolute h-px w-4 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-px w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute h-px w-4 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
    )
}