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
    gallery?: {
        src: string;
    }[];
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
        gallery: [
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784644870/Dashboard_eb0jbt.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784644978/POS_qwrw49.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784644952/Inventario_qiliep.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784644967/Pedido_fzbhgz.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784644936/Empleado_gbhgn9.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784644985/Sugerido_lp4qj7.png`,
            },
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
        gallery: [
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125175/13_tuqvwn.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125168/12_zooxeq.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125163/11_tvcc0d.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125156/10_smclpx.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125149/09_pviokl.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125143/08_m0ii8v.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125135/07_agqujt.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125130/06_ra7wni.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125114/05_a4gst2.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125107/04_spsjnh.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125100/03_cuzu1u.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125082/02_bogsa1.png`,
            },
            {
                src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788125068/01_x6ojvc.png`,
            },
        ]
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
            { labelKey: "demo", href: "https://trendoragm.netlify.app/", kind: "demo" },
        ],
    },
    {
        slug: "restaurante-aspnet",
        context: "personal",
        type: "public",
        year: "2024",
        stack: ["C#", "ASP.NET", "Entity Framework", "SQL Server", "Razor Views"],
        links: [{ labelKey: "repositorio", href: "https://github.com/Gerardoprogramer/Restaurante", kind: "repo" }],
        gallery: [
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679477/InicioSeccion_mfjetf.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679447/CrearCuenta_lc6fft.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679506/Medidas_znbk6b.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679467/Ingredientes_nkhh3o.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679555/Platillos_n74xyk.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679458/DetallePlatillo_vsq7re.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679523/Menu_cnoper.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679489/ItemMenu_kwub4h.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679536/MenuCompleto_ickty4.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679541/Mesas_qu4t9g.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1784679549/OrdenarMesa_tvptvy.png` },
        ],
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
        gallery: [
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788127314/S-05_wcyoza.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788127306/S-04_avkwaa.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788127300/S-03_n9vhor.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788127294/S-02_ntdieb.png` },
            { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1788127290/S-01_lr2prj.png` },
        ]
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