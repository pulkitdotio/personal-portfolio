import { motion, useReducedMotion } from "motion/react";
import { technologies } from "../../data/portfolio";
import { revealUp } from "../../lib/motion";
import { Container } from "../layout/Container";
import { TechnologyChip } from "../ui/TechnologyChip";

export function TechStack() {
  const shouldReduceMotion = useReducedMotion();
  const initialRevealState = shouldReduceMotion ? "visible" : "hidden";

  return (
    <Container as="section" id="stack" className="stack-section" aria-labelledby="stack-title">
      <motion.div
        className="stack-content"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={revealUp}
      >
        <div className="stack-heading">
          <h2 id="stack-title">Tech Stack</h2>
        </div>

        <ul className="technology-list" aria-label="Technologies">
          {technologies.map((technology) => (
            <TechnologyChip key={technology.name} technology={technology} />
          ))}
        </ul>
      </motion.div>
    </Container>
  );
}
