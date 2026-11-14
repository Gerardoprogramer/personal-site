import type { Language } from "@/lib/i18n/lang";

export type ProjectSlug =
  | "libra"
  | "la-central"
  | "obsidian-library"
  | "selvatica";

export interface ProjectCover {
  src: string;
  width: number;
  height: number;
}

export interface Project {
  slug: ProjectSlug;
  name: string;
  year: string;
  color: string;
  surface: string;
  // "featured" projects fill the main grid; "exploration" ones go to the
  // smaller Explorations list below it.
  tier: "featured" | "exploration";
  // Missing while the screenshot is pending: the image slot then shows a
  // placeholder in development and is left out in production.
  cover?: ProjectCover;
  stack: string[];
  // One URL, or one per site language when the demo is localized.
  demo?: string | Record<Language, string>;
  repositories: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "libra",
    name: "Libra",
    year: "2026",
    color: "#aebce6",
    surface: "#141927",
    tier: "featured",
    // Versions from Libra's package.json (next 16.4.3, react 19.2.8).
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Drizzle",
      "Cloudflare R2",
    ],
    demo: {
      es: "https://www.alyvenor.com/es",
      en: "https://www.alyvenor.com/en",
    },
    repositories: [
      {
        label: "GitHub",
        href: "https://github.com/Gerardoprogramer/libra",
      },
    ],
  },
  {
    slug: "la-central",
    name: "La Central",
    year: "2026",
    color: "#91c6a4",
    surface: "#142019",
    tier: "featured",
    cover: { src: "/projects/la-central-pos.png", width: 1366, height: 900 },
    stack: ["React", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "Docker"],
    repositories: [],
  },
  {
    slug: "obsidian-library",
    name: "Obsidian Library",
    year: "2026",
    color: "#dfb978",
    surface: "#211b13",
    tier: "featured",
    cover: { src: "/projects/obsidian-library.png", width: 1440, height: 900 },
    stack: [
      "Next.js",
      "TypeScript",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Stripe",
    ],
    demo: "https://library.gerardomartinez.dev",
    repositories: [
      {
        label: "Frontend",
        href: "https://github.com/Gerardoprogramer/library-management-system-next",
      },
      {
        label: "Backend",
        href: "https://github.com/Gerardoprogramer/Library-Management-System",
      },
    ],
  },
  {
    slug: "selvatica",
    name: "Selvática",
    year: "2026",
    color: "#c7c59b",
    surface: "#1b211c",
    tier: "exploration",
    cover: { src: "/projects/selvatica-cover.png", width: 1440, height: 1000 },
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"],
    demo: "https://selvatica.gerardomartinez.dev",
    repositories: [
      {
        label: "GitHub",
        href: "https://github.com/Gerardoprogramer/selvatica",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.tier === "featured");
export const explorationProjects = projects.filter(
  (p) => p.tier === "exploration",
);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectDemo(project: Project, language: Language) {
  if (!project.demo) return undefined;
  return typeof project.demo === "string"
    ? project.demo
    : project.demo[language];
}
