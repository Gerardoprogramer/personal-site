import type { ProjectView } from '@/content/ProjectView';
import { FeaturedProject } from '../sections/projects/FeaturedProject';
import { ProjectCard } from '../sections/projects/ProjectCard';

export const DetailCard = ({ project }: { project: ProjectView }) => {

  return project.featured ? (
    <FeaturedProject project={project} />
  ) : (
    <ProjectCard project={project} full />
  );
}
