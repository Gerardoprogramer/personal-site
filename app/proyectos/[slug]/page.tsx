import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getProject } from "@/content/projects";
import { projectsContent } from "@/lib/i18n/projects.content";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { languageAlternates, localizedUrl, ogLocale } from "@/lib/seo";
import { toLanguage } from "@/lib/i18n/lang";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const language = toLanguage((await headers()).get("x-language"));
  const copy = projectsContent[language][project.slug];
  const path = `/proyectos/${project.slug}`;
  const canonicalUrl = localizedUrl(path, language);
  return {
    title: project.name,
    description: copy.summary,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "article",
      title: `${project.name} | Gerardo Martínez`,
      description: copy.summary,
      url: canonicalUrl,
      locale: ogLocale(language),
      // Without a cover the site's default Open Graph image applies.
      ...(project.cover && {
        images: [
          {
            url: project.cover.src,
            width: project.cover.width,
            height: project.cover.height,
            alt: copy.coverAlt ?? project.name,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: copy.summary,
      ...(project.cover && { images: [project.cover.src] }),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} />;
}
