"use client";

import { motion, useReducedMotion } from "framer-motion";
import { containerStagger, item as itemPreset, reveal as revealPreset } from "./presets";

export function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  const preset = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2, delay } }
    : revealPreset(delay);

  return (
    <motion.div className={className} initial={preset.initial} animate={preset.animate} transition={preset.transition}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", delayChildren = 0.06, stagger = 0.06 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={containerStagger(delayChildren, stagger)} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={itemPreset} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
}
