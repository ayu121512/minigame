"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  /** Zero-based index of the current stage. */
  current: number;
  /** Total number of stages. */
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const reduceMotion = useReducedMotion();
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal - 1);
  const percent = ((safeCurrent + 1) / safeTotal) * 100;

  return (
    <div
      role="progressbar"
      aria-label={`Stage ${safeCurrent + 1} of ${safeTotal}`}
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={safeCurrent + 1}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-white/8", className)}
    >
      <motion.div
        className="from-violet to-accent h-full rounded-full bg-gradient-to-r"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
