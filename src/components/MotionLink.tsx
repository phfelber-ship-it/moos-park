"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

const SPRING = { type: "spring", stiffness: 400, damping: 22 } as const;

type MotionLinkProps = ComponentProps<typeof Link> & {
  className?: string;
  fullWidth?: boolean;
};

export default function MotionLink({
  children,
  className,
  fullWidth = true,
  ...props
}: MotionLinkProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING}
      className={`inline-block rounded-lg ${fullWidth ? "w-full" : "w-full sm:w-auto"}`}
    >
      <Link className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}
