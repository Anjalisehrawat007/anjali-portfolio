"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { ReactNode } from "react";

/** Scroll-triggered fade/rise. Renders instantly when reduced motion is preferred. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  y?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -5% 0px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}
