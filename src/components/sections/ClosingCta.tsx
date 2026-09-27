import { Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { revealUp } from "../../lib/motion";
import { Container } from "../layout/Container";

export function ClosingCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Container
      as="section"
      className="closing-section"
      aria-labelledby="closing-title"
    >
      <motion.div
        className="closing-content"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={revealUp}
      >
        <h2 id="closing-title">Let&apos;s talk.</h2>
        <p>If you want to discuss a project or anything technical, send me an email.</p>
        <a
          className="closing-email"
          href="mailto:pulkit1865@gmail.com"
          aria-label="Email Pulkit Sharma"
        >
          <Mail aria-hidden="true" />
          <span>Email</span>
        </a>
      </motion.div>
    </Container>
  );
}
