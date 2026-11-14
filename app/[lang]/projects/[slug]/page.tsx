import {
  ProjectRoute,
  projectMetadata,
  projectStaticParams,
  type ProjectRouteProps,
} from "@/components/pages/project-route";

// English case studies: /en/projects/<slug>.
export const dynamicParams = false;

export function generateStaticParams() {
  return projectStaticParams("en");
}

export function generateMetadata({ params }: ProjectRouteProps) {
  return projectMetadata(params, "en");
}

export default function Page({ params }: ProjectRouteProps) {
  return <ProjectRoute params={params} lang="en" />;
}
