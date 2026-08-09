"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Extra delay in seconds added to the base 0.1s. */
  delay?: number;
  /** Entry offset in px; negative values enter from above. */
  y?: number;
  /**
   * "view" (default) fires once on viewport enter; "mount" fires on page load,
   * for content that is already inside the initial viewport (hero, nav).
   */
  mode?: "view" | "mount";
}

/**
 * System reveal: opacity 0.001 -> 1, y 24 -> 0 on a critically damped spring
 * (bounce 0, duration 1.5s, base delay 0.1s).
 */
export function Reveal({ children, className, delay = 0, y = 24, mode = "view" }: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const transition = {
    type: "spring",
    bounce: 0,
    duration: 1.5,
    delay: 0.1 + delay,
  } as const;

  if (mode === "mount") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0.001, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
