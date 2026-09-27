import { motion, useReducedMotion } from "motion/react";
import { socialLinks } from "../../data/portfolio";
import {
  reducedGroup,
  reducedReveal,
  revealGroup,
  sectionReveal,
  sectionViewport,
  socialLinksReveal,
} from "../../lib/motion";
import { Container } from "../layout/Container";
import { SocialLink } from "../ui/SocialLink";

export function Connect() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? reducedReveal : sectionReveal;

  return (
    <Container as="section" id="connect" className="connect-section" aria-labelledby="connect-title">
      <motion.div
        className="connect-content"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={shouldReduceMotion ? reducedGroup : revealGroup}
      >
        <motion.h2 id="connect-title" variants={itemVariants}>
          Connect
        </motion.h2>
        <motion.div
          className="social-links"
          variants={shouldReduceMotion ? reducedGroup : socialLinksReveal}
        >
          {socialLinks.map((link) => (
            <motion.div className="social-link-item" key={link.label} variants={itemVariants}>
              <SocialLink link={link} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );
}
