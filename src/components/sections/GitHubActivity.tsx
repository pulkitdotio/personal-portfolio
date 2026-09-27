import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import { motion, useReducedMotion } from "motion/react";
import {
  reducedGroup,
  reducedReveal,
  revealGroup,
  sectionReveal,
  sectionViewport,
} from "../../lib/motion";
import { Container } from "../layout/Container";

const GITHUB_USERNAME = "pulkitdotio";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const GitHubCalendarPanel = lazy(() =>
  import("./GitHubCalendarPanel").then((module) => ({
    default: module.GitHubCalendarPanel,
  })),
);

export function GitHubActivity() {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? reducedReveal : sectionReveal;
  const currentYear = new Date().getFullYear();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [shouldLoadCalendar, setShouldLoadCalendar] = useState(false);

  useEffect(() => {
    const calendarElement = calendarRef.current;

    if (!calendarElement || typeof IntersectionObserver === "undefined") {
      setShouldLoadCalendar(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadCalendar(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(calendarElement);
    return () => observer.disconnect();
  }, []);

  return (
    <Container
      as="section"
      id="github"
      className="github-section"
      aria-labelledby="github-title"
    >
      <motion.div
        className="github-content"
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={shouldReduceMotion ? reducedGroup : revealGroup}
      >
        <motion.div className="github-heading" variants={itemVariants}>
          <h2 id="github-title">GitHub Activity</h2>
        </motion.div>

        <motion.div className="github-activity-body" variants={itemVariants}>
          <div className="github-calendar-viewport">
            <div
              ref={calendarRef}
              className="github-calendar-frame"
              aria-label={`${currentYear} GitHub contributions`}
            >
              {shouldLoadCalendar ? (
                <Suspense fallback={<div className="github-calendar-placeholder" aria-hidden="true" />}>
                  <GitHubCalendarPanel year={currentYear} />
                </Suspense>
              ) : (
                <div className="github-calendar-placeholder" aria-hidden="true" />
              )}
            </div>
          </div>

          <div className="github-footer">
            <span className="github-scroll-hint" aria-hidden="true">
              Swipe to explore
            </span>
            <a
              className="github-profile-link"
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View Pulkit's GitHub profile (opens in a new tab)"
            >
              View GitHub
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
