"use client";

import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";
import type { MoodId } from "@/lib/game";

const QUESTION = "How angry are you right now? 👀";

export interface MoodOption {
  readonly id: MoodId;
  readonly emoji: string;
  readonly label: string;
  /** Anger percentage, drives the meter and the headline. */
  readonly level: number;
  /** One or more reaction lines, revealed in sequence. */
  readonly lines: readonly string[];
}

const MOOD_OPTIONS: readonly MoodOption[] = [
  {
    id: "very-angry",
    emoji: "😡",
    label: "VERY ANGRY",
    level: 97,
    lines: ["Oh.", "We're cooked. 💀"],
  },
  {
    id: "little",
    emoji: "😐",
    label: "A LITTLE",
    level: 50,
    lines: ["Okay... manageable. 🫡"],
  },
  {
    id: "not-much",
    emoji: "🙂",
    label: "NOT MUCH",
    level: 23,
    lines: ["WE HAVE A CHANCE. 📈"],
  },
  {
    id: "fine",
    emoji: "🥹",
    label: "I'M FINE",
    level: 0,
    lines: ["Wait... really? 😭"],
  },
];

/**
 * Mood Check: Karuna rates her anger, and the answer comes back as a reading
 * with a reaction. Choices stay switchable so a mis-tap is never a dead end.
 */
export function MoodCheck() {
  const { mood, setMood, goNext } = useGame();
  const questionId = useId();

  const selected = MOOD_OPTIONS.find((option) => option.id === mood) ?? null;

  return (
    <GlassCard glow padding="lg">
      <Eyebrow>Mood Check</Eyebrow>

      <h2 id={questionId} className="text-title mt-4">
        {QUESTION}
      </h2>

      {/* min-w-0 avoids the fieldset's intrinsic min-content width on mobile. */}
      <fieldset aria-labelledby={questionId} className="mt-7 min-w-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MOOD_OPTIONS.map((option) => (
            <MoodOptionButton
              key={option.id}
              option={option}
              checked={option.id === mood}
              onSelect={setMood}
            />
          ))}
        </div>
      </fieldset>

      <AnimatePresence mode="wait">
        {selected ? (
          <MoodResult key={selected.id} option={selected} onContinue={goNext} />
        ) : null}
      </AnimatePresence>
    </GlassCard>
  );
}

function MoodOptionButton({
  option,
  checked,
  onSelect,
}: {
  option: MoodOption;
  checked: boolean;
  onSelect: (mood: MoodId) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name="mood"
        value={option.id}
        checked={checked}
        onChange={() => onSelect(option.id)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex min-h-14 touch-manipulation items-center gap-3 rounded-2xl border px-4 py-3",
          "border-white/10 bg-white/4",
          "transition-[background-color,border-color,transform] duration-200",
          "hover:border-white/20 hover:bg-white/8 active:scale-[0.99]",
          "peer-checked:border-accent/60 peer-checked:bg-accent/12",
          "peer-focus-visible:ring-accent peer-focus-visible:ring-2",
        )}
      >
        <span aria-hidden className="text-xl leading-none sm:text-2xl">
          {option.emoji}
        </span>
        <span className="font-display text-sm font-semibold tracking-wide sm:text-base">
          {option.label}
        </span>
      </span>
    </label>
  );
}

function MoodResult({
  option,
  onContinue,
}: {
  option: MoodOption;
  onContinue: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-live="polite"
      className="mt-7"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{
        duration: reduceMotion ? 0 : 0.35,
        ease: EASE_OUT_EXPO,
      }}
    >
      <div className="border-accent/20 bg-accent/6 rounded-2xl border p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-muted text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
            Anger Level
          </p>
          <p className="font-display text-accent text-2xl font-bold tabular-nums sm:text-3xl">
            {option.level}%
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="Anger level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={option.level}
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/8"
        >
          <motion.div
            className="from-violet to-accent h-full rounded-full bg-gradient-to-r"
            initial={{ width: 0 }}
            animate={{ width: `${option.level}%` }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.8, ease: EASE_OUT_EXPO }
            }
          />
        </div>

        <div className="mt-5 space-y-1.5">
          {option.lines.map((line, index) => (
            <motion.p
              key={line}
              className="font-display text-foreground text-lg font-semibold sm:text-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : 0.15 + index * 0.12,
                ease: EASE_OUT_EXPO,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-6"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : 0.35,
          ease: EASE_OUT_EXPO,
        }}
      >
        <Button size="lg" fullWidth onClick={onContinue} className="group">
          CONTINUE
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Button>
      </motion.div>
    </motion.div>
  );
}
