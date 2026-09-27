import { motion, useReducedMotion } from "motion/react";
import { technologies } from "../../data/portfolio";
import {
  reducedGroup,
  reducedReveal,
  revealGroup,
  sectionReveal,
  sectionViewport,
} from "../../lib/motion";
import { Container } from "../layout/Container";
import { TechnologyChip } from "../ui/TechnologyChip";

export function TechStack() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? reducedReveal : sectionReveal;

  return (
    <Container as="section" id="stack" className="stack-section" aria-labelledby="stack-title">
      <motion.div
        className="stack-content"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={shouldReduceMotion ? reducedGroup : revealGroup}
      >
        <motion.div className="stack-heading" variants={itemVariants}>
          <h2 id="stack-title">Tech Stack</h2>
        </motion.div>

        <motion.ul className="technology-list" aria-label="Technologies" variants={itemVariants}>
          {technologies.map((technology) => (
            <TechnologyChip key={technology.name} technology={technology} />
          ))}
        </motion.ul>
      </motion.div>
    </Container>
  );
}
