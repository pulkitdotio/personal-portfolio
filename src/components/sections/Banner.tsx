import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import banner960 from "../../assets/banner/banner-960.webp";
import banner1600 from "../../assets/banner/banner-1600.webp";
import banner2400 from "../../assets/banner/banner-2400.webp";
import bannerImage from "../../assets/banner/banner.webp";
import { Container } from "../layout/Container";

const bannerAlt = "Dark mountain ridges beneath a low, clouded sunset sky";
const bannerSrcSet = `${banner960} 960w, ${banner1600} 1600w, ${banner2400} 2400w, ${bannerImage} 3200w`;
const bannerSizes =
  "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1279px) calc(100vw - 96px), 1168px";

function AnimatedBanner() {
  const frameRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-7, 7]);

  return (
    <figure ref={frameRef} className="banner">
      <motion.img
        className="banner-image banner-image--animated"
        src={bannerImage}
        srcSet={bannerSrcSet}
        sizes={bannerSizes}
        width={3200}
        height={900}
        alt={bannerAlt}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
        initial={{ scale: 1.012 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ y }}
      />
    </figure>
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
            srcSet={bannerSrcSet}
            sizes={bannerSizes}
            width={3200}
            height={900}
            alt={bannerAlt}
            loading="eager"
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
