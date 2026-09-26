import { motion, useReducedMotion } from "motion/react";
import { socialLinks } from "../../data/portfolio";
import { revealUp } from "../../lib/motion";
import { Container } from "../layout/Container";
import { SocialLink } from "../ui/SocialLink";

export function Connect() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Container as="section" id="connect" className="connect-section" aria-labelledby="connect-title">
      <motion.div
        className="connect-content"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={revealUp}
      >
        <h2 id="connect-title">Connect</h2>
        <div className="social-links">
          {socialLinks.map((link) => (
            <SocialLink key={link.label} link={link} />
          ))}
        </div>
      </motion.div>
    </Container>
  );
}
