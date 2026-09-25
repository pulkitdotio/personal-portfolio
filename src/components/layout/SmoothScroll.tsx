import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const lenis = new Lenis({
      anchors: { offset: -80 },
      autoRaf: true,
      duration: 1.05,
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return children;
}
