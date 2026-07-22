"use client";

import { motion, type TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale";

const VARIANTS: Record<
  Direction,
  { hidden: TargetAndTransition; show: TargetAndTransition }
> = {
  up: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const variant = VARIANTS[direction];

  return (
    <motion.div
      initial={variant.hidden}
      whileInView={variant.show}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
