import { Translations } from "@/lib/i18n/context";

export interface Experience {
    company: string;
    role: string;
    period: string;
    format: string;
    built: string[];
    learned: string;
}

export const experience = (t: Translations): Experience[] => [
    {
        company: "4thewords",
        role: t.experience["4thewords"].role,
        period: "2025",
        format: t.experience["4thewords"].format,
        built: t.experience["4thewords"].built,
        learned: t.experience["4thewords"].learned,
    },
    {
        company: "Funread",
        role: t.experience.funread.role,
        period: "2024",
        format: t.experience.funread.format,
        built: t.experience.funread.built,
        learned: t.experience.funread.learned,
    },
];