import type { ComponentType, SVGProps } from "react";
import {
    SiPython,
    SiFastapi,
    SiDjango,
    SiSpringboot,
    SiTypescript,
    SiReact,
    SiNextdotjs,
    SiVuedotjs,
    SiTailwindcss,
    SiPostgresql,
    SiMysql,
    SiDocker,
    SiGit,
    SiSocketdotio,
    SiSharp,
    SiDotnet,
    SiJavascript,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Translations } from "@/lib/i18n/context";

export const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    Python: SiPython,
    FastAPI: SiFastapi,
    Django: SiDjango,
    Java: FaJava,
    "Spring Boot": SiSpringboot,
    TypeScript: SiTypescript,
    React: SiReact,
    "Next.js": SiNextdotjs,
    "Vue.js": SiVuedotjs,
    "Tailwind CSS": SiTailwindcss,
    PostgreSQL: SiPostgresql,
    MySQL: SiMysql,
    Docker: SiDocker,
    Git: SiGit,
    WebSockets: SiSocketdotio,
    "C#": SiSharp,
    "ASP.NET": SiDotnet,
    JavaScript: SiJavascript,
};

interface Props {
    label: string,
    id: string,
    items: string[],
    secondary?: boolean
}


export const stackGroups = (t: Translations): Props[] => [
    {
        label: "Backend",
        id: "backend",
        items: ["Python", "FastAPI", "Django", "Java", "Spring Boot"],
    },
    {
        label: "Frontend",
        id: "frontend",
        items: ["TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS"],
    },
    {
        label: t.Stack.labeldata,
        id: "data",
        items: ["PostgreSQL", "MySQL", "Docker", "Git", "WebSockets"],
    },
    {
        label: t.Stack.labelsecond,
        id: "secondary",
        items: ["C#", "ASP.NET", "JavaScript"],
        secondary: true,
    },
];