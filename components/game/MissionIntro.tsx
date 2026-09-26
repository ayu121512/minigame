"use client";

import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";

/** Reveal beats in seconds, measured from mount. */
const ENTRANCE = {
  rows: 0.25,
  rowStagger: 0.09,
  action: 0.75,
} as const;

export type BriefingTone = "default" | "accent" | "muted";

const TONE_STYLES: Readonly<Record<BriefingTone, string>> = {
  default: "text-foreground",
  accent: "text-accent",
  muted: "text-muted",
};

export interface BriefingRow {
  readonly label: string;
  readonly value: string;
  readonly tone: BriefingTone;
}

/** Briefing content, kept separate from the presentation. */
const BRIEFING_ROWS: readonly BriefingRow[] = [
  { label: "Primary objective", value: "Make Karuna smile.", tone: "default" },
  { label: "Difficulty", value: "Extremely difficult 😭", tone: "accent" },
  {
    label: "Current status",
    value: "Karuna = Slightly Angry 😤",
    tone: "default",
  },
  { label: "Mission success", value: "Unknown...", tone: "muted" },
];

/**
 * The mission briefing: a game-style objective card that arrives like a
 * transmission, then hands over to the Mood Check.
 */
export function MissionIntro() {
  const { goNext } = useGame();
  const reduceMotion = useReducedMotion();

  return (
    <GlassCard glow padding="lg">
      <Eyebrow pulse>Mission Briefing</Eyebrow>

      <h2 className="text-title mt-4">MISSION OBJECTIVE</h2>

      <dl className="mt-7 divide-y divide-white/8 border-t border-white/8">
        {BRIEFING_ROWS.map((row, index) => (
          <MissionRow key={row.label} row={row} index={index} />
        ))}
      </dl>

      <motion.div
        className="mt-8"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : ENTRANCE.action,
          ease: EASE_OUT_EXPO,
        }}
      >
        <Button size="lg" fullWidth onClick={goNext}>
          ACCEPT MISSION 🫡
        </Button>
      </motion.div>
    </GlassCard>
  );
}

function MissionRow({ row, index }: { row: BriefingRow; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : ENTRANCE.rows + index * ENTRANCE.rowStagger,
        ease: EASE_OUT_EXPO,
      }}
    >
      <dt className="text-muted text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
        {row.label}
      </dt>
      <dd
        className={cn(
          "font-display text-base font-semibold sm:text-right sm:text-lg",
          TONE_STYLES[row.tone],
        )}
      >
        {row.value}
      </dd>
    </motion.div>
  );
}
