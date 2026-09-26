"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Ambient background layer: a static gradient wash, two very slow glow
 * blooms, and a vignette. Kept deliberately calm — no busy particle field.
 */
export function BackgroundEffects() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#1a0f2e_0%,#0a0714_45%,#050409_100%)]" />

      {/* Slow purple bloom, upper left */}
      <motion.div
        className="bg-violet/12 absolute -top-32 -left-24 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96"
        animate={reduceMotion ? undefined : { opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Slow accent bloom, lower right */}
      <motion.div
        className="bg-accent/10 absolute -right-24 -bottom-32 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96"
        animate={reduceMotion ? undefined : { opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette keeps focus on the centre column */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_50%,transparent_35%,rgba(5,4,9,0.85)_100%)]" />
    </div>
  );
}
