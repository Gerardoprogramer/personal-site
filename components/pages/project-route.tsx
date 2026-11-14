import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/content/projects";
import { projectsContent } from "@/lib/i18n/projects.content";
import type { Language } from "@/lib/i18n/lang";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { JsonLd } from "@/components/seo/JsonLd";
import { personBaseJsonLd, projectJsonLd } from "@/lib/structured-data";
import { PROJECT_SLUGS, isLanguage } from "@/lib/routes";
import {
  languageAlternates,
  localizedUrl,
  ogLocale,
  otherLanguage,
} from "@/lib/seo";

// Shared by /es/proyectos/[slug] and /en/projects/[slug]: each folder only
// fixes its language.

export type ProjectRouteProps = {
  params: Promise<{ lang: string; slug: string }>;
};

// Generates the parent [lang] too, so each folder exists in one language only
// (/en/proyectos/libra and /es/projects/libra are 404s).
export function projectStaticParams(lang: Language) {
  return PROJECT_SLUGS.map((slug) => ({ lang, slug }));
}

async function resolve(params: ProjectRouteProps["params"], lang: Language) {
  const { lang: segment, slug } = await params;
  const project = getProject(slug);
  if (!isLanguage(segment) || segment !== lang || !project) notFound();
  return project;
}

export async function projectMetadata(
  params: ProjectRouteProps["params"],
  lang: Language,
): Promise<Metadata> {
  const project = await resolve(params, lang);
  const copy = projectsContent[lang][project.slug];
  const route = { page: "project", slug: project.slug } as const;
  const canonicalUrl = localizedUrl(route, lang);
  return {
    title: project.name,
    description: copy.summary,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(route),
    },
    openGraph: {
      type: "article",
      title: `${project.name} | Gerardo Martínez`,
      description: copy.summary,
      url: canonicalUrl,
      locale: ogLocale(lang),
      alternateLocale: ogLocale(otherLanguage(lang)),
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

export async function ProjectRoute({
  params,
  lang,
}: ProjectRouteProps & { lang: Language }) {
  const project = await resolve(params, lang);
  const pageUrl = localizedUrl({ page: "project", slug: project.slug }, lang);
  return (
    <>
      <JsonLd data={personBaseJsonLd()} />
      <JsonLd data={projectJsonLd(project, lang, pageUrl)} />
      <ProjectCaseStudy project={project} />
    </>
  );
}
