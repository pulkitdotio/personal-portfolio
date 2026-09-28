import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down.mjs";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import { socialLinks } from "../../data/portfolio";
import { Container } from "../layout/Container";
import { useMotionPreferences } from "../motion/MotionPreferences";
import VectorWordmark from "../motion/VectorWordmark";
import { RotatingRole } from "./RotatingRole";

const wordmarkFont = {
  fontFamily: '"Train One", sans-serif',
  fontWeight: 400,
  letterSpacing: "-0.035em",
};
const mobileLines = ["PULKIT", "SHARMA"];
const handles = { size: 54, spread: 42, labels: true };

export function Hero() {
  const { enabled, pageVisible } = useMotionPreferences();
  const journey = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [faded, setFaded] = useState(false);
  const position = useRef<{ element: HTMLElement; top: number } | null>(null);
  const { scrollYProgress } = useScroll({
    target: journey,
    offset: ["start start", "end end"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.78, 1],
    [1, 1, 0, 0],
  );
  const y = useTransform(scrollYProgress, [0, 0.78], [0, -24]);
  const resume = socialLinks.find((link) => link.icon === "resume")!;

  useMotionValueEvent(opacity, "change", (value) => {
    if (!content.current) return;
    const hidden = enabled && value < 0.04;
    setFaded(hidden);
    // Preserve keyboard access if a visitor is already using the hero actions.
    if (hidden && content.current.contains(document.activeElement)) {
      document
        .querySelector<HTMLElement>("#about")
        ?.focus({ preventScroll: true });
    }
    content.current.inert = hidden;
    content.current.style.visibility = hidden ? "hidden" : "visible";
  });

  useLayoutEffect(() => {
    const capture = () => {
      const header = document.querySelector("header")?.offsetHeight || 80;
      const element = Array.from(
        document.querySelectorAll<HTMLElement>("main > section"),
      ).find((section) => section.getBoundingClientRect().bottom > header);
      if (element)
        position.current = {
          element,
          top: element.getBoundingClientRect().top,
        };
    };
    window.addEventListener("portfolio-motion-will-change", capture);
    return () =>
      window.removeEventListener("portfolio-motion-will-change", capture);
  }, []);

  useLayoutEffect(() => {
    const element = journey.current;
    if (!element) return;
    element.dataset.animated = String(enabled);
    // Capture before React commits: changing MotionConfig also changes reveals
    // and browser scroll anchoring can run before this layout effect.
    const saved = position.current;
    if (saved) {
      const next =
        saved.element === element
          ? 0
          : window.scrollY +
            saved.element.getBoundingClientRect().top -
            saved.top;
      window.scrollTo({ top: Math.max(0, next), behavior: "instant" });
      position.current = null;
    }
    if (!enabled && content.current) {
      content.current.inert = false;
      content.current.style.visibility = "visible";
    }
    window.dispatchEvent(new Event("portfolio-layout-change"));
  }, [enabled]);

  return (
    <section
      ref={journey}
      className="hero-journey"
      id="profile"
      aria-labelledby="hero-title"
    >
      <div className="hero-stage">
        <motion.div
          ref={content}
          className="hero-content"
          style={{ opacity: enabled ? opacity : 1, y: enabled ? y : 0 }}
        >
          <h1 id="hero-title" className="sr-only">
            Pulkit Sharma
          </h1>
          <div className="hero-wordmark">
            <VectorWordmark
              text="PULKIT SHARMA"
              mobileLines={mobileLines}
              font={wordmarkFont}
              handles={handles}
              enabled={enabled}
              visible={pageVisible && !faded}
            />
          </div>
          <Container className="hero-bottom">
            <div className="hero-description">
              <RotatingRole />
            </div>
            <div className="hero-actions">
              <a href="#projects" className="button button-primary">
                View projects <ArrowDown aria-hidden="true" />
              </a>
              <a
                href={resume.href}
                className="button button-secondary"
                target="_blank"
                rel="noreferrer noopener"
              >
                Resume <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
