import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down.mjs";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.mjs";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import Mail from "lucide-react/dist/esm/icons/mail.mjs";
import FileText from "lucide-react/dist/esm/icons/file-text.mjs";
import xSvg from "simple-icons/icons/x.svg?raw";
import { socialLinks } from "../../data/portfolio";
import { githubIconPath } from "../../data/simpleIconPaths";
import { useMotionPreferences } from "../motion/MotionPreferences";
import VectorWordmark from "../motion/VectorWordmark";

const wordmarkFont = {
  fontFamily: '"Protest Guerrilla", sans-serif',
  fontWeight: 400,
  letterSpacing: "-0.035em",
};
const mobileLines = ["PULKIT", "SHARMA"];
const handles = { size: 80, spread: 42, labels: true };
const responsiveHandles = { size: 24, spread: 42, labels: false };
const heroSocialLinks = ["email", "github", "x", "linkedin", "resume"].map(
  (icon) => socialLinks.find((link) => link.icon === icon)!,
);
const xIconPath = xSvg.match(/<path d="([^"]+)"/)?.[1];

const desktopQuery = "(min-width: 1200px)";
function subscribeDesktop(update: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}
const getDesktop = () => window.matchMedia(desktopQuery).matches;

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "email")
    return <Mail className="hero-social-icon" aria-hidden="true" />;
  if (icon === "resume")
    return <FileText className="hero-social-icon" aria-hidden="true" />;
  return (
    <svg className="hero-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={
          icon === "linkedin"
            ? // Same LinkedIn silhouette as Connect, with transparent letter cutouts.
              "M3 1h18a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2M5 9h3v10H5zm1.5-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M10 9h3v1.4c.7-1.1 1.7-1.7 3-1.7 2.6 0 3.5 1.6 3.5 4.2V19h-3v-5.3c0-1.4-.3-2.3-1.6-2.3-1.4 0-1.9 1-1.9 2.4V19h-3z"
            : icon === "github"
              ? githubIconPath
              : xIconPath
        }
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function Hero() {
  const { enabled, pageVisible } = useMotionPreferences();
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktop,
    () => true,
  );
  const scrollAnimated = enabled && desktop;
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
  const backdropOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.9, 1],
    [1, 1, 0, 0],
  );

  useMotionValueEvent(opacity, "change", (value) => {
    document.documentElement.style.setProperty(
      "--hero-presence",
      String(scrollAnimated ? value : 1),
    );
    if (!content.current) return;
    const hidden = scrollAnimated && value < 0.04;
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
      // About can be visible while the overlapping sticky journey is still active.
      const about = document.querySelector<HTMLElement>("#about");
      const aboutInView =
        about && about.getBoundingClientRect().top < innerHeight * 0.8;
      const element = Array.from(
        document.querySelectorAll<HTMLElement>("main > section"),
      ).find(
        (section) =>
          (section !== journey.current || !aboutInView) &&
          section.getBoundingClientRect().bottom > header,
      );
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
    element.dataset.animated = String(scrollAnimated);
    document.documentElement.style.setProperty(
      "--hero-presence",
      String(scrollAnimated ? opacity.get() : 1),
    );
    // Capture before React commits: changing MotionConfig also changes reveals
    // and browser scroll anchoring can run before this layout effect.
    const saved = position.current;
    if (saved) {
      const next =
        saved.element === element && desktop
          ? 0
          : window.scrollY +
            saved.element.getBoundingClientRect().top -
            saved.top;
      window.scrollTo({ top: Math.max(0, next), behavior: "instant" });
      position.current = null;
    }
    if (!scrollAnimated && content.current) {
      content.current.inert = false;
      content.current.style.visibility = "visible";
    }
    window.dispatchEvent(new Event("portfolio-layout-change"));
    return () => {
      document.documentElement.style.removeProperty("--hero-presence");
    };
  }, [desktop, enabled, scrollAnimated, opacity]);

  return (
    <section
      ref={journey}
      className="hero-journey"
      id="profile"
      aria-labelledby="hero-title"
    >
      <div className="hero-stage">
        <motion.div
          className="hero-backdrop"
          aria-hidden="true"
          style={{ opacity: scrollAnimated ? backdropOpacity : 1 }}
        />
        <motion.div
          className="hero-architecture"
          aria-hidden="true"
          style={{ opacity: scrollAnimated ? opacity : 1 }}
        >
          <div className="hero-geometry">
            <div className="hero-plane-back" />
            <div className="hero-plane-lower" />
            <div className="hero-plane" />
            <div className="hero-cross-rule" />
            <div className="hero-diagonal" />
          </div>
        </motion.div>
        <motion.div
          ref={content}
          className="hero-content"
          style={{
            opacity: scrollAnimated ? opacity : 1,
            y: scrollAnimated ? y : 0,
          }}
        >
          <h1 id="hero-title" className="sr-only">
            Pulkit Sharma
          </h1>
          <div className="hero-identity">
            <div className="hero-wordmark">
              <VectorWordmark
                text="PULKIT SHARMA"
                mobileLines={mobileLines}
                font={wordmarkFont}
                handles={desktop ? handles : responsiveHandles}
                enabled={enabled}
                visible={pageVisible && (!scrollAnimated || !faded)}
              />
            </div>
            <p className="hero-tagline">
              Building at the intersection of
              <br />
              product, backend and AI.
            </p>
          </div>
          <div className="hero-editorial">
            <p className="hero-statement">
              <span>I build products,</span> <span>scalable backends and</span>{" "}
              <span>AI-powered systems.</span>
            </p>
            <p className="hero-availability">
              <span className="availability-dot" aria-hidden="true" />
              <span>Based in India</span>
              <span className="availability-divider" aria-hidden="true">
                /
              </span>
              <span>Open to opportunities</span>
            </p>
            <nav className="hero-text-links" aria-label="Explore the portfolio">
              <a href="#projects">
                View Projects <ArrowRight aria-hidden="true" />
              </a>
              <a href="#about">
                About Me <ArrowRight aria-hidden="true" />
              </a>
            </nav>
          </div>
          <nav className="hero-socials" aria-label="Social and contact links">
            <ul>
              {heroSocialLinks.map((link) => (
                <li key={link.icon}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer noopener" : undefined}
                  >
                    <SocialIcon icon={link.icon} />
                    <span className="hero-social-label">
                      {link.icon === "resume" ? "Résumé" : link.label}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="hero-scroll" href="#about">
            <span>Scroll to explore</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
