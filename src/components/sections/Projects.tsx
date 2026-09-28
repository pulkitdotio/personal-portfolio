import { projects } from "../../data/portfolio";
import { Container } from "../layout/Container";
import { ProjectCard } from "../projects/ProjectCard";
import { SectionHeading } from "../ui/SectionHeading";
export function Projects() {
  return (
    <Container
      as="section"
      id="projects"
      className="section projects-section"
      aria-labelledby="projects-title"
    >
      <SectionHeading title="Projects" id="projects-title" />
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </Container>
  );
}
