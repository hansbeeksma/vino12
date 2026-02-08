"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface SectionGradientBgProps {
  children: React.ReactNode;
  fromColor?: string;
  toColor?: string;
  className?: string;
}

export function SectionGradientBg({
  children,
  fromColor = "#fafaf5",
  toColor = "#f7e6ca",
  className = "",
}: SectionGradientBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    [fromColor, toColor],
  );

  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ backgroundColor: fromColor }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ backgroundColor }}>
      {children}
    </motion.div>
  );
}
