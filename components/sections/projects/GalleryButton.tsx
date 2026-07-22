"use client";

import { useState } from "react";
import { RxImage } from "react-icons/rx";
import { GalleryModal } from "./GalleryModal";
import { useTranslation } from "@/lib/i18n/context";

type GalleryItem = { src: string; caption?: string };

export const GalleryButton = ({ images, projectTitle, }: { images: GalleryItem[]; projectTitle: string; }) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    if (!images?.length) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 border-b border-border pb-0.5 font-mono-tech text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            >
                <RxImage aria-hidden="true" />
                {t.modalproject.View}
            </button>
            {open && (
                <GalleryModal
                    images={images}
                    projectTitle={projectTitle}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};