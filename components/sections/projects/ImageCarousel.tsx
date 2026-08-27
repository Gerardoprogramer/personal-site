"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
    images: string[];
    alt: string;
    emptyLabel: string;
}

export const ImageCarousel = ({ images, alt, emptyLabel }: Props) => {
    const [index, setIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    if (images.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="font-mono-tech text-[11px] text-muted-foreground/50">{emptyLabel}</span>
            </div>
        );
    }

    const goTo = (i: number) => setIndex((i + images.length) % images.length);

    return (
        <>
            <div className="group relative h-full w-full bg-surface-2">
                <Image
                    src={images[index]}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 260px, 100vw"
                />

                <button
                    onClick={() => setExpanded(true)}
                    className="absolute right-2 top-2 border border-border bg-background/80 px-2 py-1 font-mono-tech text-[10px] text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                >
                    expandir
                </button>

                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-border"}`}
                                aria-label={`imagen ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {expanded && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
                    onClick={() => setExpanded(false)}
                >
                    <button
                        onClick={() => setExpanded(false)}
                        className="absolute right-6 top-6 font-mono-tech text-xs text-muted-foreground hover:text-foreground"
                    >
                        cerrar ✕
                    </button>

                    <div
                        className="relative h-[80vh] w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image src={images[index]} alt={`${alt} ${index + 1}`} fill className="object-contain" sizes="100vw" />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => goTo(index - 1)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 border border-border bg-background/80 px-3 py-2 font-mono-tech text-sm text-foreground backdrop-blur-sm"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => goTo(index + 1)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 border border-border bg-background/80 px-3 py-2 font-mono-tech text-sm text-foreground backdrop-blur-sm"
                                >
                                    →
                                </button>
                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goTo(i)}
                                            className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-border"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};