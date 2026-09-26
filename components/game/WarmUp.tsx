"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";

/** How many times the LEAVE button dodges before it gives up. */
const MAX_DODGES = 3;

/**
 * Dodge bounds in pixels. Kept deliberately small so the button always stays
 * inside its play area — no overflow, no horizontal scroll, and always easy to
 * reach on a phone.
 */
const DODGE_X = 44;
const DODGE_Y = 20;

export interface DufferOption {
  readonly id: string;
  readonly label: string;
  /** Line shown back once Karuna picks this answer. */
  readonly response: string;
}

/** The whole joke stays aimed at Sufiyan, never at Karuna. */
const DUFFER_OPTIONS: readonly DufferOption[] = [
  { id: "yes", label: "YES 🤡", response: "Correct answer detected. 😭" },
  {
    id: "obviously",
    label: "OBVIOUSLY YES",
    response: "Okay, no hesitation. 💀",
  },
  {
    id: "no",
    label: "NO ❤️",
    response: "System error: suspicious answer detected.",
  },
];

type WarmUpStep = "duffer" | "exit";

/**
 * Warm-Up: two playful interactions before the real puzzles. Interaction one
 * asks Karuna to admit Sufiyan is a duffer; interaction two is a fake exit
 * whose LEAVE button politely refuses to work.
 */
export function WarmUp() {
  const { goNext } = useGame();
  const [step, setStep] = useState<WarmUpStep>("duffer");

  return (
    <GlassCard glow padding="lg">
      <Eyebrow pulse>Warm-Up</Eyebrow>

      <AnimatePresence mode="wait" initial={false}>
        {step === "duffer" ? (
          <WarmUpPanel key="duffer">
            <DufferQuestion onContinue={() => setStep("exit")} />
          </WarmUpPanel>
        ) : (
          <WarmUpPanel key="exit">
            <FakeExit onStart={goNext} />
          </WarmUpPanel>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

/** Shared fade/slide used when swapping between the two interactions. */
function WarmUpPanel({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

/** Interaction 1: the "is Sufiyan a duffer?" question. */
function DufferQuestion({ onContinue }: { onContinue: () => void }) {
  const questionId = useId();
  const [choice, setChoice] = useState<string | null>(null);
  const selected = DUFFER_OPTIONS.find((option) => option.id === choice) ?? null;

  return (
    <div>
      <h2 id={questionId} className="text-title mt-4">
        Be honest...
        <span className="mt-2 block">Do you think Sufiyan is a duffer?</span>
      </h2>

      {/* min-w-0 avoids the fieldset's intrinsic min-content width on mobile. */}
      <fieldset aria-labelledby={questionId} className="mt-7 min-w-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DUFFER_OPTIONS.map((option) => (
            <DufferOptionButton
              key={option.id}
              option={option}
              checked={option.id === choice}
              onSelect={setChoice}
            />
          ))}
        </div>
      </fieldset>

      <AnimatePresence mode="wait">
        {selected ? (
          <DufferResponse
            key={selected.id}
            option={selected}
            onContinue={onContinue}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function DufferOptionButton({
  option,
  checked,
  onSelect,
}: {
  option: DufferOption;
  checked: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name="duffer"
        value={option.id}
        checked={checked}
        onChange={() => onSelect(option.id)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex min-h-14 touch-manipulation items-center justify-center rounded-2xl border px-4 py-3 text-center",
          "border-white/10 bg-white/4",
          "transition-[background-color,border-color,transform] duration-200",
          "hover:border-white/20 hover:bg-white/8 active:scale-[0.99]",
          "peer-checked:border-accent/60 peer-checked:bg-accent/12",
          "peer-focus-visible:ring-accent peer-focus-visible:ring-2",
        )}
      >
        <span className="font-display text-sm font-semibold tracking-wide sm:text-base">
          {option.label}
        </span>
      </span>
    </label>
  );
}

function DufferResponse({
  option,
  onContinue,
}: {
  option: DufferOption;
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
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT_EXPO }}
    >
      <div className="border-accent/20 bg-accent/6 rounded-2xl border p-5 sm:p-6">
        <p className="font-display text-foreground text-lg font-semibold sm:text-xl">
          {option.response}
        </p>
      </div>

      <motion.div
        className="mt-6"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : 0.3,
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

/** Interaction 2: the fake exit whose LEAVE button dodges a few times. */
function FakeExit({ onStart }: { onStart: () => void }) {
  const reduceMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const surrendered = attempts >= MAX_DODGES;

  function handleDodge() {
    const next = attempts + 1;
    setAttempts(next);

    // Last attempt, or reduced motion: give up without moving anywhere.
    if (next >= MAX_DODGES || reduceMotion) {
      return;
    }

    setOffset({
      x: Math.round((Math.random() * 2 - 1) * DODGE_X),
      y: Math.round((Math.random() * 2 - 1) * DODGE_Y),
    });
  }

  return (
    <div>
      <h2 className="text-title mt-4">You can still leave this website...</h2>
      <p className="text-muted mt-2 text-sm sm:text-base">Try to click it. 👀</p>

      <div className="mt-7">
        <AnimatePresence mode="wait" initial={false}>
          {surrendered ? (
            <motion.div
              key="surrender"
              aria-live="polite"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                ease: EASE_OUT_EXPO,
              }}
            >
              <div className="border-accent/20 bg-accent/6 rounded-2xl border p-5 sm:p-6">
                <p className="font-display text-foreground text-lg font-semibold sm:text-xl">
                  Okay okay... I&apos;ll stop. 😂
                </p>
              </div>

              <motion.div
                className="mt-6"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : 0.3,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <Button
                  size="lg"
                  fullWidth
                  onClick={onStart}
                  className="group"
                >
                  LET&apos;S ACTUALLY START
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="dodge"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: reduceMotion ? 0 : 0.3,
                ease: EASE_OUT_EXPO,
              }}
              /* Bounded play area: the dodge offsets keep the button inside,
                 and the card clips anything at its edges. */
              className="relative mx-auto h-32 w-full max-w-xs"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ x: offset.x, y: offset.y }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                >
                  <Button variant="secondary" size="lg" onClick={handleDodge}>
                    LEAVE 🚪
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
