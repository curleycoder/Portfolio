"use client";

import { motion } from "framer-motion";

export default function RevealIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  );
}
