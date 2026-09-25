import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import feather from "../../assets/identity/feather.jpg";
import { socialLinks } from "../../data/portfolio";
import { revealUp } from "../../lib/motion";
import { Container } from "./Container";

const footerLinkOrder = ["GitHub", "LinkedIn", "Twitter", "Email"] as const;

export function SiteFooter() {
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <Container as="footer" className="site-footer">
      <motion.div
        className="footer-inner"
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={revealUp}
      >
        <div className="footer-identity">
          <img src={feather} alt="" width="30" height="30" aria-hidden="true" />
          <div>
            <p className="footer-name">Pulkit Sharma</p>
            <p className="footer-signature">making things. understanding things.</p>
          </div>
        </div>

        <nav className="footer-links" aria-label="Social links">
          {footerLinkOrder.map((label) => {
            const link = socialLinks.find((item) => item.label === label);

            if (!link) {
              return null;
            }

            return (
              <a
                key={label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer noopener" : undefined}
                aria-label={link.external ? `${label} (opens in a new tab)` : "Email Pulkit Sharma"}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="footer-meta">
          <p>© {currentYear} Pulkit Sharma</p>
          <a className="back-to-top" href="#top">
            Back to top
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </Container>
  );
}
