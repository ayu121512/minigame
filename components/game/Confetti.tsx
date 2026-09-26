"use client";

import { motion, useReducedMotion } from "motion/react";

const COLORS = ["#ff3d7f", "#8b5cf6", "#f472b6", "#fbbf24", "#a78bfa", "#ffffff"];

interface Confetto {
  readonly left: number;
  readonly size: number;
  readonly delay: number;
  readonly duration: number;
  readonly spin: number;
  readonly sway: number;
  readonly color: number;
  readonly round: boolean;
  readonly tall: boolean;
}

/** Fixed, deterministic field so the burst is calm and hydration-safe. */
const CONFETTI: readonly Confetto[] = [
  { left: 4, size: 9, delay: 0, duration: 3.4, spin: 320, sway: 40, color: 0, round: false, tall: true },
  { left: 9, size: 7, delay: 0.35, duration: 3.0, spin: -260, sway: 30, color: 1, round: true, tall: false },
  { left: 15, size: 10, delay: 0.12, duration: 3.8, spin: 420, sway: 50, color: 2, round: false, tall: true },
  { left: 21, size: 8, delay: 0.6, duration: 3.2, spin: -340, sway: 35, color: 3, round: true, tall: false },
  { left: 27, size: 9, delay: 0.05, duration: 3.6, spin: 280, sway: 45, color: 4, round: false, tall: true },
  { left: 33, size: 7, delay: 0.8, duration: 2.9, spin: -300, sway: 28, color: 5, round: true, tall: false },
  { left: 38, size: 11, delay: 0.2, duration: 4.0, spin: 380, sway: 55, color: 0, round: false, tall: true },
  { left: 44, size: 8, delay: 0.45, duration: 3.3, spin: -250, sway: 32, color: 2, round: true, tall: false },
  { left: 50, size: 9, delay: 0.9, duration: 3.5, spin: 300, sway: 42, color: 1, round: false, tall: true },
  { left: 56, size: 7, delay: 0.3, duration: 3.1, spin: -360, sway: 26, color: 3, round: true, tall: false },
  { left: 61, size: 10, delay: 1.05, duration: 3.9, spin: 400, sway: 52, color: 4, round: false, tall: true },
  { left: 67, size: 8, delay: 0.5, duration: 3.2, spin: -280, sway: 34, color: 5, round: true, tall: false },
  { left: 72, size: 9, delay: 0.15, duration: 3.7, spin: 340, sway: 46, color: 0, round: false, tall: true },
  { left: 78, size: 7, delay: 0.7, duration: 3.0, spin: -320, sway: 30, color: 2, round: true, tall: false },
  { left: 83, size: 10, delay: 0.25, duration: 4.1, spin: 440, sway: 58, color: 1, round: false, tall: true },
  { left: 88, size: 8, delay: 0.95, duration: 3.3, spin: -240, sway: 36, color: 3, round: true, tall: false },
  { left: 93, size: 9, delay: 0.4, duration: 3.6, spin: 300, sway: 44, color: 4, round: false, tall: true },
  { left: 97, size: 7, delay: 1.15, duration: 2.9, spin: -300, sway: 24, color: 5, round: true, tall: false },
  { left: 12, size: 8, delay: 1.2, duration: 3.4, spin: 260, sway: 38, color: 5, round: false, tall: true },
  { left: 30, size: 7, delay: 1.0, duration: 3.0, spin: -280, sway: 30, color: 0, round: true, tall: false },
  { left: 47, size: 9, delay: 1.25, duration: 3.8, spin: 380, sway: 48, color: 3, round: false, tall: true },
  { left: 64, size: 7, delay: 1.1, duration: 3.1, spin: -340, sway: 32, color: 1, round: true, tall: false },
  { left: 80, size: 8, delay: 1.3, duration: 3.5, spin: 300, sway: 40, color: 2, round: false, tall: true },
  { left: 25, size: 6, delay: 1.35, duration: 3.2, spin: -260, sway: 26, color: 4, round: true, tall: false },
  { left: 70, size: 6, delay: 1.4, duration: 3.6, spin: 360, sway: 34, color: 5, round: false, tall: true },
  { left: 52, size: 6, delay: 1.45, duration: 3.3, spin: -280, sway: 28, color: 1, round: true, tall: false },
];

/**
 * A single, gentle burst of confetti. Rendered outside the stage transition so
 * it can cover the whole viewport, and skipped entirely for reduced motion.
 */
export function Confetti() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {CONFETTI.map((piece, index) => (
        <motion.span
          key={index}
          className="absolute top-0 block will-change-transform"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.tall ? piece.size * 1.8 : piece.size,
            backgroundColor: COLORS[piece.color % COLORS.length],
            borderRadius: piece.round ? "9999px" : "2px",
          }}
          initial={{ y: "-14vh", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["-14vh", "-6vh", "70vh", "116vh"],
            x: [0, piece.sway, -piece.sway * 0.6, 0],
            rotate: [0, piece.spin * 0.35, piece.spin * 0.7, piece.spin],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            times: [0, 0.15, 0.8, 1],
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
