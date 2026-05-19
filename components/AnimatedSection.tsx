"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right";

type AnimatedSectionProps = {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
};

export default function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
  className,
}: AnimatedSectionProps) {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -24, y: 0 }
      : direction === "right"
        ? { opacity: 0, x: 24, y: 0 }
        : { opacity: 0, x: 0, y: 24 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
