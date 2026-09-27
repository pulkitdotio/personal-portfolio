import { Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  reducedGroup,
  reducedReveal,
  revealGroup,
  sectionReveal,
  sectionViewport,
} from "../../lib/motion";
import { Container } from "../layout/Container";

export function ClosingCta() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? reducedReveal : sectionReveal;

  return (
    <Container
      as="section"
      className="closing-section"
      aria-labelledby="closing-title"
    >
      <motion.div
        className="closing-content"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={shouldReduceMotion ? reducedGroup : revealGroup}
      >
        <motion.div className="closing-copy" variants={itemVariants}>
          <h2 id="closing-title">Let&apos;s talk.</h2>
          <p>If you want to discuss a project or anything technical, send me an email.</p>
        </motion.div>
        <motion.a
          className="closing-email"
          href="mailto:pulkit1865@gmail.com"
          aria-label="Email Pulkit Sharma"
          variants={itemVariants}
        >
          <Mail aria-hidden="true" />
          <span>Email</span>
        </motion.a>
      </motion.div>
    </Container>
  );
}
