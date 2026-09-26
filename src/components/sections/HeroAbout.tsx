import { motion, useReducedMotion } from "motion/react";
import feather from "../../assets/identity/feather.jpg";
import { revealUp, staggerChildren } from "../../lib/motion";
import { Container } from "../layout/Container";

export function HeroAbout() {
  const shouldReduceMotion = useReducedMotion();
  const initialRevealState = shouldReduceMotion ? "visible" : "hidden";

  return (
    <Container as="section" id="about" className="hero-section" aria-labelledby="hero-title">
      <motion.div
        className="identity-block"
        initial={initialRevealState}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div className="feather-frame" variants={revealUp}>
          <img src={feather} alt="Pulkit Sharma's feather identity mark" />
        </motion.div>

        <motion.div className="identity-copy" variants={staggerChildren}>
          <motion.h1 id="hero-title" variants={revealUp}>
            Pulkit Sharma
          </motion.h1>
          <motion.p className="primary-role" variants={revealUp}>
            Full Stack Developer
          </motion.p>
          <motion.p className="secondary-role" variants={revealUp}>
            AI/ML Enthusiast
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className="about-copy"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={revealUp}
      >
        <h2>About</h2>
        <ul className="about-list">
          <li>I build full-stack web applications, mostly with the MERN stack.</li>
          <li>
            I enjoy backend work as much as frontend work, especially APIs, databases, and the
            systems behind an application.
          </li>
          <li>
            I&apos;m also interested in AI/ML and use Python-based tools when a project genuinely
            benefits from them.
          </li>
        </ul>
      </motion.div>
    </Container>
  );
}
