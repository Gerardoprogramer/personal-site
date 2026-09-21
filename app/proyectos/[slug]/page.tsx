import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getProject } from "@/content/projects";
import { projectsContent } from "@/lib/i18n/projects.content";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const language = (await headers()).get("x-language") === "en" ? "en" : "es";
  const copy = projectsContent[language][project.slug];
  const base = `https://gerardomartinez.dev/proyectos/${project.slug}`;
  return {
    title: project.name,
    description: copy.summary,
    alternates: {
      canonical: `${base}?lang=${language}`,
      languages: {
        es: `${base}?lang=es`,
        en: `${base}?lang=en`,
        "x-default": base,
      },
    },
    openGraph: {
      type: "article",
      title: `${project.name} | Gerardo Martínez`,
      description: copy.summary,
      url: `${base}?lang=${language}`,
      locale: language === "es" ? "es_CR" : "en_US",
      images: [
        {
          url: project.image,
          width: project.imageWidth,
          height: project.imageHeight,
          alt: copy.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: copy.summary,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} />;
}
