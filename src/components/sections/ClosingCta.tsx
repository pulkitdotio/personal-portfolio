import { ArrowUpRight, BriefcaseBusiness, GitFork, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { socialLinks } from "../../data/portfolio";
import { revealUp, staggerChildren } from "../../lib/motion";
import { Container } from "../layout/Container";

const ctaActions = [
  { label: "Email", icon: Mail, primary: true },
  { label: "GitHub", icon: GitFork, primary: false },
  { label: "LinkedIn", icon: BriefcaseBusiness, primary: false },
] as const;

export function ClosingCta() {
  const shouldReduceMotion = useReducedMotion();
  const initialRevealState = shouldReduceMotion ? "visible" : "hidden";

  return (
    <Container
      as="section"
      className="closing-section"
      aria-labelledby="closing-title"
    >
      <motion.div
        className="closing-copy"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={staggerChildren}
      >
        <motion.span className="closing-accent" variants={revealUp} aria-hidden="true" />
        <motion.p className="section-kicker" variants={revealUp}>
          Start a conversation
        </motion.p>
        <motion.h2 id="closing-title" variants={revealUp}>
          Have an idea worth building? Let&apos;s talk.
        </motion.h2>
        <motion.p className="closing-description" variants={revealUp}>
          I&apos;m always interested in thoughtful products, engineering problems, and opportunities
          to build useful software.
        </motion.p>
      </motion.div>

      <motion.div
        className="closing-actions"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerChildren}
        aria-label="Contact actions"
      >
        {ctaActions.map(({ label, icon: Icon, primary }) => {
          const link = socialLinks.find((item) => item.label === label);

          if (!link) {
            return null;
          }

          return (
            <motion.a
              key={label}
              className={`closing-action${primary ? " closing-action--primary" : ""}`}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer noopener" : undefined}
              aria-label={link.external ? `${label} (opens in a new tab)` : "Email Pulkit Sharma"}
              variants={revealUp}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {link.external ? <ArrowUpRight aria-hidden="true" /> : null}
            </motion.a>
          );
        })}
      </motion.div>
    </Container>
  );
}
