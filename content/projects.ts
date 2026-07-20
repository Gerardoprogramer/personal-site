export type ProjectContext = "personal" | "freelance" | "profesional";
export type ProjectType = "public" | "partial" | "confidential" | "in-development";

export interface Project {
    slug: string;
    context: ProjectContext;
    type: ProjectType;
    featured?: boolean;
    year: string;
    stack: string[];
    impact?: { labelKey: string; value: string }[];
    links?: { labelKey: string; href: string; kind: "demo" | "repo" | "frontend" | "backend" }[];
}

export const projects: Project[] = [
    {
        slug: "erp-minisuper",
        context: "freelance",
        type: "confidential",
        featured: true,
        year: "2026",
        stack: ["Java", "Spring Boot", "Next.js", "TypeScript", "PostgreSQL", "WebSocket", "Docker"],
        impact: [
            { labelKey: "modulos", value: "6" },
            { labelKey: "endpoints", value: "31" },
            { labelKey: "architecture", value: "DDD + Hexagonal + CQRS" },
        ],
    },
    {
        slug: "strata-ai-workspace",
        context: "personal",
        type: "in-development",
        year: "2026 — en curso",
        stack: ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "pgvector", "RAG", "OpenAI", "LlamaIndex"],
        links: [
            { labelKey: "frontend", href: "https://github.com/Gerardoprogramer/strata-web", kind: "frontend" },
            { labelKey: "backend", href: "https://github.com/Gerardoprogramer/strata-api", kind: "backend" },
        ],
    },
    {
        slug: "biblioteca-stripe",
        context: "personal",
        type: "public",
        year: "2026",
        stack: ["Java", "Spring Boot", "Next.js", "TypeScript", "PostgreSQL", "Stripe"],
        impact: [{ labelKey: "endpoints", value: "69" }],
        links: [
            { labelKey: "demo", href: "https://obsidian-delta-kohl.vercel.app", kind: "demo" },
            { labelKey: "frontend", href: "https://github.com/Gerardoprogramer/library-management-system-next", kind: "frontend" },
            { labelKey: "backend", href: "https://github.com/Gerardoprogramer/Library-Management-System", kind: "backend" },
        ],
    },
    {
        slug: "trendora-ecommerce",
        context: "personal",
        type: "public",
        year: "2025",
        stack: ["React", "TypeScript", "Vite", "Zustand", "TanStack Query", "NestJS", "TypeORM", "PostgreSQL"],
        links: [
            { labelKey: "frontend", href: "https://github.com/Gerardoprogramer/Trendora", kind: "frontend" },
            { labelKey: "backend", href: "https://github.com/Gerardoprogramer/Trendora-Backend", kind: "backend" },
        ],
    },
    {
        slug: "restaurante-aspnet",
        context: "personal",
        type: "public",
        year: "2024",
        stack: ["C#", "ASP.NET", "Entity Framework", "SQL Server", "Razor Views"],
        links: [{ labelKey: "repositorio", href: "https://github.com/Gerardoprogramer/Restaurante", kind: "repo" }],
    },
    {
        slug: "selvatica-landing",
        context: "personal",
        type: "public",
        year: "2026",
        stack: ["Next.js", "TypeScript", "Tailwind CSS"],
        impact: [
            { labelKey: "performance", value: "100" },
            { labelKey: "accessibility", value: "100" },
            { labelKey: "bestPractices", value: "100" },
            { labelKey: "seo", value: "100" },
        ],
        links: [
            { labelKey: "demo", href: "https://selvatica.vercel.app", kind: "demo" },
            { labelKey: "repositorio", href: "https://github.com/Gerardoprogramer/selvatica", kind: "repo" },
        ],
    },
    {
        slug: "backend-4thewords",
        context: "profesional",
        type: "confidential",
        year: "2025",
        stack: ["Vue.js", "Python", "MySQL", "Docker", "Redis"],
    },
    {
        slug: "backend-funread",
        context: "profesional",
        type: "confidential",
        year: "2024",
        stack: ["Python", "Django", "MySQL"],
    },
];