import { motion } from "motion/react";
import { Container } from "../layout/Container";

const signalPaths = [
  "M-80 215 C 90 112, 230 272, 430 148 S 760 45, 930 142 S 1190 254, 1390 96",
  "M-110 246 C 68 143, 250 291, 445 181 S 760 76, 954 171 S 1210 280, 1420 126",
  "M-70 175 C 105 73, 245 230, 421 111 S 737 15, 918 108 S 1180 213, 1400 57",
  "M-130 285 C 58 181, 267 326, 467 218 S 792 115, 980 211 S 1240 314, 1450 163",
  "M-70 131 C 110 38, 273 181, 449 75 S 765 -11, 945 66 S 1210 167, 1410 22",
];

export function Banner() {
  return (
    <Container>
      <motion.div
        className="banner"
        initial={{ opacity: 0, clipPath: "inset(0 0 14% 0 round 14px)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 14px)" }}
        transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <div className="banner-glow banner-glow--one" />
        <div className="banner-glow banner-glow--two" />
        <svg
          className="banner-lines"
          viewBox="0 0 1280 300"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="signal-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7c85ff" stopOpacity="0" />
              <stop offset="0.24" stopColor="#8e98ff" stopOpacity="0.22" />
              <stop offset="0.61" stopColor="#7784ff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#9278ff" stopOpacity="0" />
            </linearGradient>
            <filter id="soft-glow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path
            d="M-120 238 C 70 80, 278 302, 493 136 S 820 36, 1002 139 S 1215 260, 1430 63"
            stroke="#7180ff"
            strokeOpacity="0.16"
            strokeWidth="16"
            filter="url(#soft-glow)"
          />
          {signalPaths.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              stroke="url(#signal-gradient)"
              strokeWidth={index === 2 ? 1.35 : 0.8}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.35, delay: 0.25 + index * 0.06 },
                opacity: { duration: 0.5, delay: 0.2 + index * 0.04 },
              }}
            />
          ))}
        </svg>
        <div className="banner-vignette" />
      </motion.div>
    </Container>
  );
}
