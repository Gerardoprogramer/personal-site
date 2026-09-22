"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FiMaximize2, FiX } from "react-icons/fi";
import { useTranslation } from "@/lib/i18n/context";
import { caseLabels } from "@/lib/i18n/projects.content";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  eager?: boolean;
}

export function ProjectImage({
  src,
  alt,
  width,
  height,
  caption,
  eager,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [imageOpen, setImageOpen] = useState(false);
  const { language } = useTranslation();
  const labels = caseLabels[language];
  return (
    <figure className="min-w-0">
      <button
        type="button"
        onClick={() => {
          setImageOpen(true);
          dialog.current?.showModal();
        }}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/10 bg-surface"
        aria-label={`${labels.inspect}: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 92vw, 1120px"
          loading={eager ? "eager" : "lazy"}
          className="h-auto w-full"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-xs text-foreground shadow-lg backdrop-blur">
          {labels.inspect}
          <FiMaximize2 aria-hidden="true" className="size-3.5 shrink-0" />
        </span>
      </button>
      {caption && (
        <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
      <dialog
        ref={dialog}
        aria-label={alt}
        className="image-dialog"
        onClose={() => setImageOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="relative">
          <button
            autoFocus
            type="button"
            onClick={() => dialog.current?.close()}
            className="sticky left-full top-3 z-10 mb-3 flex min-h-11 items-center gap-3 rounded-full border border-border bg-background px-5 text-sm text-foreground"
          >
            {labels.close}
            <FiX aria-hidden="true" className="size-4 shrink-0" />
          </button>
          {imageOpen && (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="96vw"
              className="h-auto w-full rounded-md"
            />
          )}
        </div>
      </dialog>
    </figure>
  );
}
