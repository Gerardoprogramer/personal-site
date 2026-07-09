"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProjectsView = "list" | "map";

const VIEW_PARAM = "view";
const VIEW_MAP_VALUE = "mapa";

export function useProjectsViewState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const view: ProjectsView =
        searchParams.get(VIEW_PARAM) === VIEW_MAP_VALUE ? "map" : "list";

    const setView = useCallback(
        (nextView: ProjectsView) => {
            const params = new URLSearchParams(searchParams.toString());

            if (nextView === "map") {
                params.set(VIEW_PARAM, VIEW_MAP_VALUE);
            } else {
                params.delete(VIEW_PARAM);
            }

            const query = params.toString();
            const url = query ? `${pathname}?${query}` : pathname;

            router.replace(url, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    return { view, setView };
}