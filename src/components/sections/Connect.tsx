import { motion } from "motion/react";
import { socialLinks } from "../../data/portfolio";
import { revealUp, staggerChildren } from "../../lib/motion";
import { Container } from "../layout/Container";
import { SocialLink } from "../ui/SocialLink";

export function Connect() {
  return (
    <Container as="section" id="connect" className="connect-section" aria-labelledby="connect-title">
      <motion.div
        className="section-heading connect-heading"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.55 }}
        variants={revealUp}
      >
        <div>
          <p className="section-kicker">Say hello</p>
          <h2 id="connect-title">Connect</h2>
        </div>
        <p>Find me elsewhere on the web, or send a note directly.</p>
      </motion.div>

      <motion.div
        className="social-links"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={staggerChildren}
      >
        {socialLinks.map((link) => (
          <motion.div key={link.label} variants={revealUp}>
            <SocialLink link={link} />
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
