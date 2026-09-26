import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import bannerImage from "../../assets/banner/banner.webp";
import { Container } from "../layout/Container";

const bannerAlt = "Dark mountain ridges beneath a low, clouded sunset sky";

function AnimatedBanner() {
  const frameRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <motion.figure
      ref={frameRef}
      className="banner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        className="banner-image banner-image--animated"
        src={bannerImage}
        width={3200}
        height={900}
        alt={bannerAlt}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        initial={{ scale: 1.025 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ y }}
      />
    </motion.figure>
  );
}

export function Banner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Container>
      {shouldReduceMotion ? (
        <figure className="banner">
          <img
            className="banner-image"
            src={bannerImage}
            width={3200}
            height={900}
            alt={bannerAlt}
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
        </figure>
      ) : (
        <AnimatedBanner />
      )}
    </Container>
  );
}
