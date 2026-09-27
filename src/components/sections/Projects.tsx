import { motion, useReducedMotion } from "motion/react";
import { projects } from "../../data/portfolio";
import {
  createProjectCardReveal,
  reducedReveal,
  sectionReveal,
  sectionViewport,
} from "../../lib/motion";
import { Container } from "../layout/Container";
import { ProjectCard } from "../projects/ProjectCard";

export function Projects() {
  const shouldReduceMotion = useReducedMotion();
  const headingVariants = shouldReduceMotion ? reducedReveal : sectionReveal;

  return (
    <Container as="section" id="projects" className="projects-section" aria-labelledby="projects-title">
      <div className="projects-section-content">
        <motion.div
          className="projects-heading"
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={headingVariants}
        >
          <h2 id="projects-title">Projects</h2>
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              motionVariants={
                shouldReduceMotion ? reducedReveal : createProjectCardReveal(index * 0.08)
              }
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
