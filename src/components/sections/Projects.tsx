import { motion } from "motion/react";
import { projects } from "../../data/portfolio";
import { revealUp, staggerChildren } from "../../lib/motion";
import { Container } from "../layout/Container";
import { ProjectCard } from "../projects/ProjectCard";

export function Projects() {
  return (
    <Container as="section" id="projects" className="projects-section" aria-labelledby="projects-title">
      <motion.div
        className="section-heading projects-heading"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.65 }}
        variants={revealUp}
      >
        <div>
          <p className="section-kicker">Build / 02</p>
          <h2 id="projects-title">Selected Projects</h2>
        </div>
        <p>A selection of full-stack, AI-assisted, and backend systems work.</p>
      </motion.div>

      <motion.div
        className="projects-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={staggerChildren}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </motion.div>
    </Container>
  );
}
