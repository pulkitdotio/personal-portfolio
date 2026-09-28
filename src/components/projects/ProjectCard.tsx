import { useRef, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import type { Project } from "../../data/portfolio";
import { githubIconPath } from "../../data/simpleIconPaths";
import { timings } from "../../lib/motion";
import { useMotionPreferences } from "../motion/MotionPreferences";
import { Reveal } from "../motion/Reveal";
import { TechTag } from "../ui/TechTag";
import { ProjectMediaFrame } from "./ProjectMedia";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { enabled } = useMotionPreferences();
  const frame = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lightX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const lightY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const highlight = useMotionTemplate`radial-gradient(300px circle at ${lightX}% ${lightY}%, #ffffff12, transparent 75%)`;
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [2, -2]), {
    stiffness: 180,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-2, 2]), {
    stiffness: 180,
    damping: 24,
  });
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !enabled ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const isLive = project.actions.some((action) => action.kind === "live");
  return (
    <Reveal
      delay={index === 2 ? timings.stagger : 0}
      className={
        project.featured
          ? "project-wrap project-wrap--featured"
          : "project-wrap"
      }
    >
      <article
        className={
          project.featured
            ? "project-card project-card--featured"
            : "project-card"
        }
        style={{ "--project-accent": project.accent } as CSSProperties}
      >
        <div
          ref={frame}
          className="project-stage"
          onPointerMove={move}
          onPointerLeave={reset}
        >
          {enabled && (
            <motion.div
              className="project-highlight"
              style={{ background: highlight }}
              aria-hidden="true"
            />
          )}
          <Reveal variant="preview">
            <motion.div
              className="project-preview-transform"
              style={{
                rotateX: enabled ? rotateX : 0,
                rotateY: enabled ? rotateY : 0,
              }}
            >
              <ProjectMediaFrame title={project.title} media={project.media} />
            </motion.div>
          </Reveal>
        </div>
        <div className="project-content">
          <div className="project-eyebrow">
            {isLive && (
              <span className="project-live-status">
                <i /> Live
              </span>
            )}
          </div>
          <h3>{project.title}</h3>
          <p className="project-description">{project.description}</p>
          {project.engineeringHighlight && (
            <p className="engineering-highlight">
              {project.engineeringHighlight}
            </p>
          )}
          <ul
            className="tech-tags"
            aria-label={project.title + " technologies"}
          >
            {project.technologies.map((technology) => (
              <TechTag key={technology.label} technology={technology} />
            ))}
          </ul>
          <div className="project-actions">
            {project.actions.map((action) => (
              <a
                key={action.kind}
                href={action.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={
                  (action.kind === "live"
                    ? "View live project"
                    : "Source code") +
                  ": " +
                  project.title +
                  " (opens in a new tab)"
                }
              >
                {action.kind === "github" && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={githubIconPath} fill="currentColor" />
                  </svg>
                )}
                <span>
                  {action.kind === "live" ? "View live project" : "Source code"}
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
