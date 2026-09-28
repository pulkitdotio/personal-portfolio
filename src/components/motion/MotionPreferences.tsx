import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(update: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  const onChange = () => {
    window.dispatchEvent(new Event("portfolio-motion-will-change"));
    update();
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;

const MotionContext = createContext({
  paused: false,
  reduced: false,
  enabled: true,
  pageVisible: true,
  toggle: () => {},
});
export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem("portfolio-motion-paused") === "true";
    } catch {
      return false;
    }
  });
  const [pageVisible, setPageVisible] = useState(true);
  const enabled = !paused && !reduced;
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion =
      enabled && pageVisible ? "on" : "off";
    try {
      localStorage.setItem("portfolio-motion-paused", String(paused));
    } catch {
      /* Storage is optional. */
    }
  }, [enabled, paused, pageVisible]);
  return (
    <MotionContext.Provider
      value={{
        paused,
        reduced,
        enabled,
        pageVisible,
        toggle: () => {
          window.dispatchEvent(new Event("portfolio-motion-will-change"));
          setPaused((p) => !p);
        },
      }}
    >
      <MotionConfig reducedMotion={enabled ? "user" : "always"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useMotionPreferences() {
  return useContext(MotionContext);
}
