import { motion } from "motion/react";
import { useMotionPreferences } from "../motion/MotionPreferences";
import { Reveal } from "../motion/Reveal";
import { easeOut } from "../../lib/motion";
export function SectionHeading({ title, id }: { title: string; id: string }) {
  const { enabled } = useMotionPreferences();
  return (
    <div className="section-heading">
      <div className="heading-mask">
        <Reveal variant="heading">
          <h2 id={id}>{title}</h2>
        </Reveal>
      </div>
      <motion.div
        className="section-rule"
        initial={enabled ? { scaleX: 0 } : false}
        whileInView={{ scaleX: 1 }}
        animate={!enabled ? { scaleX: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOut }}
      />
    </div>
  );
}
