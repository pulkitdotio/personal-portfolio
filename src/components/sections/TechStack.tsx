import { motion, useReducedMotion } from "motion/react";
import { technologyGroups } from "../../data/portfolio";
import { revealUp, stackRowReveal, staggerChildren } from "../../lib/motion";
import { Container } from "../layout/Container";
import { TechnologyChip } from "../ui/TechnologyChip";

export function TechStack() {
  const shouldReduceMotion = useReducedMotion();
  const initialRevealState = shouldReduceMotion ? "visible" : "hidden";

  return (
    <Container as="section" id="stack" className="stack-section" aria-labelledby="stack-title">
      <motion.div
        className="section-heading stack-heading"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.55 }}
        variants={revealUp}
      >
        <div>
          <p className="section-kicker">Stack / 03</p>
          <h2 id="stack-title">Tech Stack</h2>
        </div>
        <p>Technologies I use to build reliable products from interface to infrastructure.</p>
      </motion.div>

      <motion.ul
        className="stack-groups"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={staggerChildren}
      >
        {technologyGroups.map((group) => (
          <motion.li className="stack-group" key={group.title} variants={stackRowReveal}>
            <h3>{group.title}</h3>
            <motion.ul className="technology-list" aria-label={`${group.title} technologies`}>
              {group.technologies.map((technology) => (
                <TechnologyChip key={technology.name} technology={technology} />
              ))}
            </motion.ul>
          </motion.li>
        ))}
      </motion.ul>
    </Container>
  );
}
