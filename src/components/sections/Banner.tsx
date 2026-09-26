import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import bannerImage from "../../assets/banner/banner.webp";
import { Container } from "../layout/Container";

function AnimatedBannerImage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-8, 12]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.025, 1.055]);

  return (
    <motion.img
      ref={imageRef}
      className="banner-image"
      src={bannerImage}
      alt="A quiet mountain landscape beneath a cloudy blue-hour sky"
      style={{ y, scale }}
    />
  );
}

export function Banner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Container>
      <motion.figure
        className="banner"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {shouldReduceMotion ? (
          <img
            className="banner-image"
            src={bannerImage}
            alt="A quiet mountain landscape beneath a cloudy blue-hour sky"
          />
        ) : (
          <AnimatedBannerImage />
        )}
      </motion.figure>
    </Container>
  );
}
