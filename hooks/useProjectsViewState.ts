"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProjectsView = "list" | "map";

const VIEW_PARAM = "view";
const VIEW_MAP_VALUE = "mapa";
const PAGE_PARAM = "page";
const SLUG_PARAM = "slug";

export function useProjectsViewState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const view: ProjectsView =
        searchParams.get(VIEW_PARAM) === VIEW_MAP_VALUE ? "map" : "list";

    const rawPage = Number(searchParams.get(PAGE_PARAM));
    const page = Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : 1;

    const selectedSlug = view === "map" ? searchParams.get(SLUG_PARAM) : null;

    const navigate = useCallback(
        (params: URLSearchParams, mode: "push" | "replace") => {
            const query = params.toString();
            const url = query ? `${pathname}?${query}` : pathname;
            router[mode](url, { scroll: false });
        },
        [pathname, router]
    );

    const setView = useCallback(
        (nextView: ProjectsView) => {
            const params = new URLSearchParams(searchParams.toString());

            if (nextView === "map") {
                params.set(VIEW_PARAM, VIEW_MAP_VALUE);
            } else {
                params.delete(VIEW_PARAM);
                params.delete(SLUG_PARAM);
            }
            params.delete(PAGE_PARAM);

            navigate(params, "replace");
        },
        [navigate, searchParams]
    );

    const setPage = useCallback(
        (nextPage: number) => {
            const params = new URLSearchParams(searchParams.toString());

            if (nextPage <= 1) {
                params.delete(PAGE_PARAM);
            } else {
                params.set(PAGE_PARAM, String(nextPage));
            }

            navigate(params, "push");
        },
        [navigate, searchParams]
    );

    const setSelectedSlug = useCallback(
        (slug: string | null) => {
            const params = new URLSearchParams(searchParams.toString());

            if (slug) {
                params.set(SLUG_PARAM, slug);
                navigate(params, "push");
            } else {
                params.delete(SLUG_PARAM);
                navigate(params, "replace");
            }
        },
        [navigate, searchParams]
    );

    return { view, setView, page, setPage, selectedSlug, setSelectedSlug };
}