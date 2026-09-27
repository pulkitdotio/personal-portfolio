import { cloneElement } from "react";
import { GitHubCalendar } from "react-github-calendar";
import "react-github-calendar/tooltips.css";

const GITHUB_USERNAME = "pulkitdotio";

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

type GitHubCalendarPanelProps = {
  year: number;
};

export function GitHubCalendarPanel({ year }: GitHubCalendarPanelProps) {
  return (
    <GitHubCalendar
      username={GITHUB_USERNAME}
      year={year}
      colorScheme="dark"
      theme={contributionTheme}
      blockSize={13}
      blockMargin={4}
      blockRadius={2}
      fontSize={12}
      showWeekdayLabels={["mon", "wed", "fri"]}
      labels={{
        totalCount: `{{count}} contributions in ${year}`,
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
  );
}
