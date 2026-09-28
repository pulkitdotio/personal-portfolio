import type { Variants, ViewportOptions } from "motion/react";
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const timings = {
  reveal: 0.6,
  stagger: 0.07,
  role: 0.45,
  roleInterval: 3000,
  preview: 0.8,
};
export const sectionViewport = {
  once: true,
  amount: 0.12,
} satisfies ViewportOptions;
type Options = { delay: number; immediate: boolean };
export const revealVariants = {
  text: {
    hidden: { opacity: 0, y: 12 },
    visible: ({ delay, immediate }: Options) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: immediate ? 0 : timings.reveal,
        ease: easeOut,
        delay,
      },
    }),
  },
  heading: {
    hidden: { y: "105%" },
    visible: ({ delay, immediate }: Options) => ({
      y: 0,
      transition: {
        duration: immediate ? 0 : timings.reveal,
        ease: easeOut,
        delay,
      },
    }),
  },
  preview: {
    hidden: { clipPath: "inset(100% 0 0 0 round 5px)", scale: 1.035 },
    visible: ({ delay, immediate }: Options) => ({
      clipPath: "inset(0% 0 0 0 round 5px)",
      scale: 1,
      transition: {
        duration: immediate ? 0 : timings.preview,
        ease: easeOut,
        delay,
      },
    }),
  },
} satisfies Record<string, Variants>;
