import { cloneElement } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import { revealUp } from "../../lib/motion";
import { Container } from "../layout/Container";

const GITHUB_USERNAME = "pulkitdotio";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const contributionTheme = {
  dark: ["#151515", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

function formatContributionLabel(activity: { date: string; count: number }) {
  const date = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${activity.date}T00:00:00Z`));
  const contributionLabel = activity.count === 1 ? "contribution" : "contributions";

  return `${activity.count} ${contributionLabel} on ${date}`;
}

export function GitHubActivity() {
  const shouldReduceMotion = useReducedMotion();
  const initialRevealState = shouldReduceMotion ? "visible" : "hidden";
  const currentYear = new Date().getFullYear();

  return (
    <Container
      as="section"
      id="github"
      className="github-section"
      aria-labelledby="github-title"
    >
      <motion.div
        className="github-content"
        initial={initialRevealState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={revealUp}
      >
        <div className="github-heading">
          <h2 id="github-title">GitHub Activity</h2>
        </div>

        <div className="github-calendar-viewport">
          <div className="github-calendar-frame" aria-label={`${currentYear} GitHub contributions`}>
            <GitHubCalendar
              username={GITHUB_USERNAME}
              year={currentYear}
              colorScheme="dark"
              theme={contributionTheme}
              blockSize={13}
              blockMargin={4}
              blockRadius={2}
              fontSize={12}
              showWeekdayLabels={["mon", "wed", "fri"]}
              labels={{
                totalCount: `{{count}} contributions in ${currentYear}`,
                legend: { less: "Less", more: "More" },
              }}
              errorMessage="GitHub activity couldn't be loaded right now."
              renderBlock={(block, activity) =>
                cloneElement(block, {
                  "aria-label": formatContributionLabel(activity),
                })
              }
              tooltips={{
                activity: {
                  text: formatContributionLabel,
                  hoverRestMs: 120,
                  withArrow: true,
                },
              }}
            />
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
    </Container>
  );
}
