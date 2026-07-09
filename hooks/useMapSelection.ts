"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { ProjectContext } from '@/content/projects'

type FocusableElement = HTMLOrSVGElement & Element;

type UseMapSelectionResult = {
    hovered: string | null;
    setHovered: (key: string | null) => void;
    overflowClusterId: ProjectContext | null;
    closeRef: RefObject<HTMLButtonElement | null>;
    closeOverlay: () => void;
    openProject: (slug: string, origin: FocusableElement) => void;
    openOverflow: (clusterId: ProjectContext, origin: FocusableElement) => void;
};

export function useMapSelection(
    selectedSlug: string | null,
    onSelectSlug: (slug: string | null) => void,
): UseMapSelectionResult {
    const [overflowClusterId, setOverflowClusterId] = useState<ProjectContext | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const lastFocusRef = useRef<FocusableElement | null>(null);

    const activeOverlay = selectedSlug !== null || overflowClusterId !== null;

    function closeOverlay() {
        onSelectSlug(null);
        setOverflowClusterId(null);
        lastFocusRef.current?.focus();
    }

    useEffect(() => {
        if (activeOverlay && closeRef.current) closeRef.current.focus();
    }, [activeOverlay]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && activeOverlay) closeOverlay();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeOverlay]);

    function openProject(slug: string, origin: FocusableElement) {
        lastFocusRef.current = origin;
        onSelectSlug(slug);
    }

    function openOverflow(clusterId: ProjectContext, origin: FocusableElement) {
        lastFocusRef.current = origin;
        setOverflowClusterId(clusterId);
    }

    return { hovered, setHovered, overflowClusterId, closeRef, closeOverlay, openProject, openOverflow };
}