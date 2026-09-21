export type ProjectSlug = "obsidian-library" | "la-central" | "selvatica";

export interface Project {
  slug: ProjectSlug;
  name: string;
  year: string;
  color: string;
  surface: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  stack: string[];
  demo?: string;
  repositories: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "obsidian-library",
    name: "Obsidian Library",
    year: "2026",
    color: "#dfb978",
    surface: "#211b13",
    image: "/projects/obsidian-cover.png",
    imageWidth: 1440,
    imageHeight: 1000,
    stack: [
      "Next.js",
      "TypeScript",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Stripe",
    ],
    demo: "https://obsidian-delta-kohl.vercel.app",
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
    slug: "la-central",
    name: "La Central",
    year: "2026",
    color: "#91c6a4",
    surface: "#142019",
    image: "/projects/la-central-pos.png",
    imageWidth: 1366,
    imageHeight: 900,
    stack: ["React", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "Docker"],
    repositories: [],
  },
  {
    slug: "selvatica",
    name: "Selvática",
    year: "2026",
    color: "#c7c59b",
    surface: "#1b211c",
    image: "/projects/selvatica-cover.png",
    imageWidth: 1440,
    imageHeight: 1000,
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

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
