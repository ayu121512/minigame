"use client";

import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";

const OPENING = "That's everything I wanted to say. ❤️";

/**
 * The letter closes with these lines. No demands, no pressure to forgive —
 * only the apology itself.
 */
const CLOSING_LINES = [
  "No more puzzles.",
  "No more excuses.",
  "Just a genuine sorry.",
] as const;

/**
 * The final note. It expresses the apology and offers a single, gentle action:
 * understanding. There is deliberately no "forgive me" button.
 */
export function FinalNote() {
  const { goNext } = useGame();
  const reduceMotion = useReducedMotion();

  return (
    <GlassCard glow padding="lg">
      <Eyebrow pulse>Final Note</Eyebrow>

      <motion.h2
        className="text-title mt-4"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          delay: reduceMotion ? 0 : 0.1,
          ease: EASE_OUT_EXPO,
        }}
      >
        {OPENING}
      </motion.h2>

      <div className="mt-6 space-y-1.5">
        {CLOSING_LINES.map((line, index) => (
          <motion.p
            key={line}
            className="font-display text-foreground/90 text-lg font-semibold sm:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              delay: reduceMotion ? 0 : 0.4 + index * 0.18,
              ease: EASE_OUT_EXPO,
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="mt-9"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : 1.1,
          ease: EASE_OUT_EXPO,
        }}
      >
        <Button size="lg" fullWidth onClick={goNext}>
          I UNDERSTAND ❤️
        </Button>
      </motion.div>
    </GlassCard>
  );
}
