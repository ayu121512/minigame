"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { PuzzleCard } from "@/components/game/PuzzleCard";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";
import { PUZZLES } from "@/lib/puzzles";

const TITLE = "THE BESTIE TEST";
const SUBTITLE = "Let's see how well you actually know this duffer. 👀";

/**
 * The Puzzle Room: five levels walked through one at a time. Progress is local
 * to this screen (no reload), and finishing hands over to the letter lock.
 */
export function PuzzleRoom() {
  const { goNext, solvePuzzle } = useGame();
  const [index, setIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  const total = PUZZLES.length;
  const puzzle = PUZZLES[index];
  const isLast = index === total - 1;

  return (
    <GlassCard glow padding="lg">
      <Eyebrow pulse>Puzzle Room</Eyebrow>

      <h2 className="text-title mt-4">{TITLE}</h2>
      <p className="text-muted mt-2 text-sm sm:text-base">{SUBTITLE}</p>

      <LevelHeader index={index} total={total} complete={complete} />

      <AnimatePresence mode="wait" initial={false}>
        {complete ? (
          <LevelTransition key="complete">
            <PuzzleComplete onContinue={goNext} />
          </LevelTransition>
        ) : (
          <LevelTransition key={puzzle.id}>
            <PuzzleCard
              puzzle={puzzle}
              continueLabel={isLast ? "CONTINUE" : "NEXT LEVEL"}
              onSolved={() => {
                solvePuzzle(puzzle.id);
                if (isLast) setComplete(true);
                else setIndex((previous) => previous + 1);
              }}
            />
          </LevelTransition>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

/** "LEVEL 01 / 05" plus the progress bar. */
function LevelHeader({
  index,
  total,
  complete,
}: {
  index: number;
  total: number;
  complete: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const level = complete ? total : index + 1;
  const percent = (level / total) * 100;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent/90 text-[0.65rem] font-semibold tracking-[0.35em] uppercase">
          LEVEL {String(level).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <p className="text-muted text-xs font-semibold tabular-nums">
          {complete ? "COMPLETE" : `${Math.round(percent)}%`}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Puzzle progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={level}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/8"
      >
        <motion.div
          className="from-violet to-accent h-full rounded-full bg-gradient-to-r"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT_EXPO }
          }
        />
      </div>
    </div>
  );
}

/** Slide between levels so each puzzle arrives as a distinct beat. */
function LevelTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/** The end-of-run reveal: all levels cleared and the letter unlocked. */
function PuzzleComplete({ onContinue }: { onContinue: () => void }) {
  const reduceMotion = useReducedMotion();

  const lines = [
    { text: "All 5 levels completed.", tone: "default" as const },
    { text: "MISSION UNLOCKED 🔓", tone: "accent" as const },
  ];

  return (
    <div className="mt-7 sm:mt-8">
      <div className="border-accent/25 bg-accent/8 rounded-2xl border p-5 sm:p-6">
        {lines.map((line, lineIndex) => (
          <motion.p
            key={line.text}
            className={cn(
              "font-display font-bold",
              line.tone === "accent"
                ? "text-accent text-glow mt-2 text-xl sm:text-2xl"
                : "text-foreground text-lg sm:text-xl",
            )}
            initial={
              reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              delay: reduceMotion ? 0 : 0.15 + lineIndex * 0.35,
              ease: EASE_OUT_EXPO,
            }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="mt-6"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : 1,
          ease: EASE_OUT_EXPO,
        }}
      >
        <Button size="lg" fullWidth onClick={onContinue} className="group">
          OPEN THE LETTER
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Button>
      </motion.div>
    </div>
  );
}
