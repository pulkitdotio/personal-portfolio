import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { revealVariants, sectionViewport } from "../../lib/motion";
import { useMotionPreferences } from "./MotionPreferences";
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "text",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: keyof typeof revealVariants;
}) {
  const { enabled } = useMotionPreferences();
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, sectionViewport);
  const props = {
    initial: enabled ? "hidden" : (false as const),
    animate: !enabled || focused || inView ? "visible" : "hidden",
    variants: revealVariants[variant],
    custom: {
      delay: enabled && !focused ? delay : 0,
      immediate: !enabled || focused,
    },
  };
  if (variant !== "text")
    return (
      <div
        ref={ref}
        className={className}
        onFocusCapture={() => setFocused(true)}
      >
        <motion.div {...props}>{children}</motion.div>
      </div>
    );
  return (
    <motion.div
      ref={ref}
      className={className}
      {...props}
      onFocusCapture={() => setFocused(true)}
    >
      {children}
    </motion.div>
  );
}
