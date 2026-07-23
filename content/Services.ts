import type { Translations } from "@/lib/i18n/context";
import type { ComponentType, SVGProps } from "react";
import { FaLayerGroup, FaWrench, FaBug, FaExchangeAlt } from "react-icons/fa";

interface propsService {
    id: string,
    icon: ComponentType<SVGProps<SVGSVGElement>>,
    title: string,
    body: string,
}

export const services = (t: Translations): propsService[] => [
    {
        id: "01",
        icon: FaLayerGroup,
        title: t.services.First.title,
        body: t.services.First.body,
    },
    {
        id: "02",
        icon: FaWrench,
        title: t.services.Second.title,
        body: t.services.Second.body,
    },
    {
        id: "03",
        icon: FaBug,
        title: t.services.Third.title,
        body: t.services.Third.body,
    },
    {
        id: "04",
        icon: FaExchangeAlt,
        title: t.services.Fourth.title,
        body: t.services.Fourth.body,
    },
];
