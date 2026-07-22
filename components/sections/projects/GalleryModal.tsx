"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/lib/i18n/context";
import Image from "next/image";
import { RxCross2, RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { getBlurPlaceholder } from "@/lib/cloudinary";

type GalleryItem = { src: string; caption?: string };

export const GalleryModal = ({ images, projectTitle, onClose, }: { images: GalleryItem[]; projectTitle: string; onClose: () => void; }) => {
    const [index, setIndex] = useState(0);
    const [mounted, setMounted] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
            if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [images.length, onClose]);

    if (!mounted) return null;

    const current = images[index];
    const nextIndex = (index + 1) % images.length;

    const modal = (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Galería — ${projectTitle}`}
            className="fixed inset-0 z-100 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 sm:p-8"
            style={{ animation: "gallery-backdrop-in 350ms ease-out both" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl"
                style={{ animation: "gallery-slide-up 650ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="text-primary">{`// ${projectTitle} — ${t.modalproject.Screenshots}`}</span>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar galería"
                        className="flex size-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                    >
                        <RxCross2 />
                    </button>
                </div>

                <div className="surface-card relative h-[60vh] max-h-130 overflow-hidden bg-surface-2">
                    <Image
                        key={`${current.src}-bg`}
                        src={current.src}
                        alt=""
                        fill
                        aria-hidden="true"
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover scale-110 opacity-40 blur-2xl"
                        placeholder="blur"
                        blurDataURL={getBlurPlaceholder(current.src)}
                    />
                    <Image
                        key={current.src}
                        src={current.src}
                        alt={current.caption ?? `${projectTitle} — ${t.modalproject.Screenshots} ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 768px"
                        priority={index === 0}
                        placeholder="blur"
                        blurDataURL={getBlurPlaceholder(current.src)}
                    />
                    {images.length > 1 && (
                        <div className="hidden">
                            <Image
                                src={images[nextIndex].src}
                                alt=""
                                width={1}
                                height={1}
                                aria-hidden="true"
                            />
                        </div>
                    )}

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                                aria-label="Captura anterior"
                                className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
                            >
                                <RxChevronLeft />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIndex((i) => (i + 1) % images.length)}
                                aria-label="Siguiente captura"
                                className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
                            >
                                <RxChevronRight />
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-3 flex items-start justify-between gap-4">
                    {current.caption ? (
                        <p className="text-sm text-muted-foreground">{current.caption}</p>
                    ) : <span />}
                    {images.length > 1 && (
                        <div className="flex shrink-0 items-center gap-1.5 font-mono-tech text-[10px] text-muted-foreground">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIndex(i)}
                                    aria-label={`Ir a captura ${i + 1}`}
                                    className={`size-1.5 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-border hover:bg-muted-foreground"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};