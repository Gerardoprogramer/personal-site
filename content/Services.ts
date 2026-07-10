import type { Translations } from "@/lib/i18n/context";

interface propsService {
    id: string,
    title: string,
    body: string,
}

export const services = (t: Translations): propsService[] => [
    {
        id: "01",
        title: t.services.First.title,
        body: t.services.First.body,
    },
    {
        id: "02",
        title: t.services.Second.title,
        body: t.services.Second.body,
    },
    {
        id: "03",
        title: t.services.Third.title,
        body: t.services.Third.body,
    },
    {
        id: "04",
        title: t.services.Fourth.title,
        body: t.services.Fourth.body,
    },
];
