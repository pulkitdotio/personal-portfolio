import { ArrowUpRight, GitFork } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import type { Project, ProjectVisualKind } from "../../data/portfolio";
import { revealUp } from "../../lib/motion";
import { TechTag } from "../ui/TechTag";
import { LedgerPlaceholder } from "./project-visuals/LedgerPlaceholder";
import { PrepRolePlaceholder } from "./project-visuals/PrepRolePlaceholder";
import { SentinelPlaceholder } from "./project-visuals/SentinelPlaceholder";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const projectVisuals: Record<ProjectVisualKind, ComponentType> = {
  sentinel: SentinelPlaceholder,
  preprole: PrepRolePlaceholder,
  ledger: LedgerPlaceholder,
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const ProjectVisual = projectVisuals[project.visual];

  return (
    <motion.article
      className={`project-card ${project.featured ? "project-card--featured" : ""}`}
      variants={revealUp}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="project-visual"
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      >
        <ProjectVisual />
      </motion.div>

      <div className="project-content">
        <div className="project-title-row">
          <div>
            <span className="project-number">0{index + 1}</span>
            <h3>{project.title}</h3>
          </div>
          <div className="project-actions" aria-label={`${project.title} links`}>
            {project.actions.map((action) => (
              <a
                key={action.kind}
                href={action.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${action.label}: ${project.title} (opens in a new tab)`}
              >
                {action.kind === "github" ? <GitFork aria-hidden="true" /> : null}
                <span>{action.label}</span>
                {action.kind === "live" ? <ArrowUpRight aria-hidden="true" /> : null}
              </a>
            ))}
          </div>
        </div>

        <p className="project-description">{project.description}</p>

        {project.engineeringHighlight ? (
          <p className="engineering-highlight">
            <span>Design note</span>
            {project.engineeringHighlight}
          </p>
        ) : null}

        <ul className="tech-tags" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <TechTag key={technology.label} technology={technology} />
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
