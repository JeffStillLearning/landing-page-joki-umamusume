"use client";

import React from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** delay in seconds */
  delay?: number;
}

/**
 * Fades + slides its children up the first time they scroll into view.
 * Note: intentionally always animates (reduced-motion not gated) per project choice.
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
