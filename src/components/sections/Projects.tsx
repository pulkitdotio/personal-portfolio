import { motion, useReducedMotion } from "motion/react";
import { projects } from "../../data/portfolio";
import { revealUp } from "../../lib/motion";
import { Container } from "../layout/Container";
import { ProjectCard } from "../projects/ProjectCard";

export function Projects() {
  const shouldReduceMotion = useReducedMotion();
  const initialRevealState = shouldReduceMotion ? "visible" : "hidden";

  return (
    <Container as="section" id="projects" className="projects-section" aria-labelledby="projects-title">
      <motion.div
        className="projects-section-content"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={revealUp}
      >
        <div className="projects-heading">
          <h2 id="projects-title">Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </motion.div>
    </Container>
  );
}
