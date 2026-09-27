import { ArrowUpRight, Globe2 } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { siGithub } from "simple-icons/icons";
import type { Project } from "../../data/portfolio";
import { sectionViewport } from "../../lib/motion";
import { TechTag } from "../ui/TechTag";
import { ProjectMediaFrame } from "./ProjectMedia";

type ProjectCardProps = {
  project: Project;
  motionVariants: Variants;
};

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={siGithub.path} fill="currentColor" />
    </svg>
  );
}

export function ProjectCard({ project, motionVariants }: ProjectCardProps) {
  const isLive = project.actions.some((action) => action.kind === "live");

  return (
    <motion.article
      className="project-card"
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={motionVariants}
    >
      <ProjectMediaFrame title={project.title} media={project.media} />

      <div className="project-content">
        <div className="project-title-row">
          <h3>{project.title}</h3>
          {isLive ? (
            <span className="project-live-status">
              <span aria-hidden="true" />
              Live
            </span>
          ) : null}
        </div>

        <p className="project-description">{project.description}</p>

        {project.engineeringHighlight ? (
          <p className="engineering-highlight">{project.engineeringHighlight}</p>
        ) : null}

        <ul className="tech-tags" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <TechTag key={technology.label} technology={technology} />
          ))}
        </ul>

        <div className="project-actions" aria-label={`${project.title} links`}>
          {project.actions.map((action) => (
            <a
              key={action.kind}
              href={action.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${action.label}: ${project.title} (opens in a new tab)`}
            >
              {action.kind === "github" ? (
                <GitHubMark />
              ) : (
                <Globe2 aria-hidden="true" />
              )}
              <span>{action.label}</span>
              <ArrowUpRight className="project-action-arrow" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
