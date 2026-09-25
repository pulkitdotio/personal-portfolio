import { motion } from "motion/react";
import feather from "../../assets/identity/feather.jpg";
import { revealUp, staggerChildren } from "../../lib/motion";
import { Container } from "../layout/Container";

export function HeroAbout() {
  return (
    <Container as="section" id="about" className="hero-section" aria-labelledby="hero-title">
      <motion.div
        className="identity-block"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div className="feather-frame" variants={revealUp}>
          <img src={feather} alt="Pulkit Sharma's feather identity mark" />
        </motion.div>

        <motion.div className="identity-copy" variants={staggerChildren}>
          <motion.p className="eyebrow" variants={revealUp}>
            Full Stack Developer
          </motion.p>
          <motion.h1 id="hero-title" variants={revealUp}>
            Pulkit Sharma
          </motion.h1>
          <motion.p className="secondary-role" variants={revealUp}>
            AI/ML Enthusiast
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className="about-copy"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.p className="section-kicker" variants={revealUp}>
          About / 01
        </motion.p>
        <motion.h2 variants={revealUp}>Building across the whole system.</motion.h2>
        <motion.p className="about-body" variants={revealUp}>
          I build full-stack web applications and backend systems with an emphasis on clean
          architecture, reliable APIs, and polished interfaces. I like understanding products end
          to end — from the UI people use to the services, queues, databases, and models behind
          them. I enjoy turning ideas into practical, well-structured software and exploring AI/ML
          where it adds real value.
        </motion.p>
      </motion.div>
    </Container>
  );
}
