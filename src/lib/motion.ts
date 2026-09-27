import type { Variants, ViewportOptions } from "motion/react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export const sectionViewport = {
  once: true,
  amount: 0.2,
} satisfies ViewportOptions;

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.03,
      staggerChildren: 0.09,
    },
  },
};

export const socialLinksReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.02,
      staggerChildren: 0.06,
    },
  },
};

export const profileReveal: Variants = {
  hidden: { opacity: 1, y: 7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

export function createProjectCardReveal(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: easeOut },
    },
  };
}

export const reducedReveal: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const reducedGroup: Variants = {
  hidden: {},
  visible: {},
};
