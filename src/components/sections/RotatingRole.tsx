import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { heroRoles } from "../../data/portfolio";
import { easeOut, timings } from "../../lib/motion";
import { useMotionPreferences } from "../motion/MotionPreferences";

export function RotatingRole() {
  const { enabled, pageVisible } = useMotionPreferences();
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!enabled || !pageVisible || !inView) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % heroRoles.length),
      timings.roleInterval,
    );
    return () => window.clearInterval(timer);
  }, [enabled, pageVisible, inView]);
  return (
    <div
      ref={ref}
      className={enabled ? "role-line" : "role-line role-line--static"}
    >
      <span className="role-dot" aria-hidden="true" />
      <span className="sr-only">{heroRoles.join(" and ")}</span>
      <div className="role-window" aria-hidden="true">
        {enabled ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={index}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: timings.role, ease: easeOut }}
            >
              {heroRoles[index]}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span>{heroRoles.join(" \u00b7 ")}</span>
        )}
      </div>
    </div>
  );
}
