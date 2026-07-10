import { useTranslation } from '@/lib/i18n/context';
import { ReactNode } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

type MapOverlayProps = {
    ariaLabel: string;
    closeRef: React.RefObject<HTMLButtonElement | null>;
    onClose: () => void;
    maxWidthClassName?: string;
    position?: "absolute" | "fixed";
    children: ReactNode;
};

export function MapOverlay({ ariaLabel, closeRef, onClose, maxWidthClassName = "max-w-xl", position = "absolute", children, }: MapOverlayProps) {
    const { t } = useTranslation();

    return (
        <div
            className={
                position === "fixed"
                    ? "fixed inset-0 z-50 overflow-y-auto bg-background/70 p-4 backdrop-blur-sm"
                    : "absolute inset-0 overflow-y-auto bg-background/70 backdrop-blur-sm"
            }
            style={{ animation: "map-fade-in 180ms ease-out both" }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
        >
            <div className="flex min-h-full items-center justify-center p-6">
                <div
                    className={`relative w-full ${maxWidthClassName}`}
                    style={{ animation: "map-materialize 260ms cubic-bezier(0.16,1,0.3,1) both" }}
                >
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        className="sticky top-0 z-10 mb-3 inline-flex items-center gap-2 border-b border-border bg-background/90 pb-0.5 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
                    >
                        <FaArrowLeft /> {t.map.return}
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
}