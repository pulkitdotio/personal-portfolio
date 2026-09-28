import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
const GitHubCalendarPanel = lazy(() =>
  import("./GitHubCalendarPanel").then((module) => ({
    default: module.GitHubCalendarPanel,
  })),
);
function CalendarPlaceholder() {
  return (
    <div className="github-calendar-placeholder" role="status">
      <div className="calendar-skeleton" aria-hidden="true">
        {Array.from({ length: 182 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <span>Loading contributions...</span>
    </div>
  );
}
class CalendarBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="calendar-error">
        GitHub activity could not be loaded right now.
      </p>
    ) : (
      this.props.children
    );
  }
}
export function GitHubActivity() {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <Container
      as="section"
      id="github"
      className="section github-section"
      aria-labelledby="github-title"
    >
      <SectionHeading title="GitHub Activity" id="github-title" />
      <Reveal className="github-panel">
        <div className="github-panel-top">
          <a
            className="github-handle"
            href="https://github.com/pulkitdotio"
            target="_blank"
            rel="noreferrer noopener"
          >
            @pulkitdotio <ArrowUpRight aria-hidden="true" />
          </a>
          <span className="eyebrow">{year} contributions</span>
        </div>
        <div
          ref={ref}
          className="github-calendar-viewport"
          tabIndex={0}
          role="region"
          aria-label="GitHub contribution calendar; scroll horizontally on small screens"
        >
          <CalendarBoundary>
            {load ? (
              <Suspense fallback={<CalendarPlaceholder />}>
                <GitHubCalendarPanel year={year} />
              </Suspense>
            ) : (
              <CalendarPlaceholder />
            )}
          </CalendarBoundary>
        </div>
        <div className="github-footer">
          <a
            className="text-link"
            href="https://github.com/pulkitdotio"
            target="_blank"
            rel="noreferrer noopener"
          >
            Explore GitHub <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </Container>
  );
}
