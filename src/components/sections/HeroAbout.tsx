import { motion, useReducedMotion } from "motion/react";
import feather from "../../assets/identity/feather.jpg";
import {
  profileReveal,
  reducedGroup,
  reducedReveal,
  revealGroup,
  sectionReveal,
  sectionViewport,
} from "../../lib/motion";
import { Container } from "../layout/Container";

export function HeroAbout() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? reducedReveal : sectionReveal;

  return (
    <Container as="section" id="about" className="hero-section" aria-labelledby="hero-title">
      <motion.div
        className="identity-block"
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        variants={shouldReduceMotion ? reducedReveal : profileReveal}
      >
        <div className="feather-frame">
          <img src={feather} alt="Pulkit Sharma's feather identity mark" />
        </div>

        <div className="identity-copy">
          <h1 id="hero-title">Pulkit Sharma</h1>
          <p className="primary-role">Full Stack Developer</p>
          <p className="secondary-role">AI/ML Enthusiast</p>
        </div>
      </motion.div>

      <motion.div
        className="about-copy"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={shouldReduceMotion ? reducedGroup : revealGroup}
      >
        <motion.h2 variants={itemVariants}>About</motion.h2>
        <motion.ul className="about-list" variants={itemVariants}>
          <li>I build full-stack web applications, mostly with the MERN stack.</li>
          <li>
            I enjoy backend work as much as frontend work, especially APIs, databases, and the
            systems behind an application.
          </li>
          <li>
            I&apos;m also interested in AI/ML and use Python-based tools when a project genuinely
            benefits from them.
          </li>
        </motion.ul>
      </motion.div>
    </Container>
  );
}
