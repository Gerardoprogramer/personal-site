import {
  ProjectRoute,
  projectMetadata,
  projectStaticParams,
  type ProjectRouteProps,
} from "@/components/pages/project-route";

// Spanish case studies: /es/proyectos/<slug>.
export const dynamicParams = false;

export function generateStaticParams() {
  return projectStaticParams("es");
}

export function generateMetadata({ params }: ProjectRouteProps) {
  return projectMetadata(params, "es");
}

export default function Page({ params }: ProjectRouteProps) {
  return <ProjectRoute params={params} lang="es" />;
}
