"use client";

import { useId, useState, type FormEvent } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { isAnswerCorrect, type Puzzle } from "@/lib/puzzles";

type Status = "idle" | "wrong" | "correct";

export interface PuzzleCardProps {
  puzzle: Puzzle;
  /** Label for the button that dismisses a solved puzzle. */
  continueLabel?: string;
  /** Called when the solved puzzle is dismissed, to move to the next level. */
  onSolved: () => void;
}

/**
 * One level of The Bestie Test. Handles text, date, and choice answers with
 * unlimited retries: a wrong answer shakes and offers a hint, never locks the
 * level. Correct answers reveal the response and a continue action.
 */
export function PuzzleCard({
  puzzle,
  continueLabel = "NEXT LEVEL",
  onSolved,
}: PuzzleCardProps) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const headingId = useId();
  const inputId = useId();

  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState("");
  const [choiceId, setChoiceId] = useState<string | null>(null);

  const solved = status === "correct";

  /** Wrong answer: gentle shake plus a hint. Never a dead end. */
  function reject() {
    setStatus("wrong");
    if (!reduceMotion) {
      void controls.start({
        x: [0, -8, 8, -6, 6, -2, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (solved) return;

    if (puzzle.kind === "choice") return;

    if (isAnswerCorrect(puzzle, value)) setStatus("correct");
    else reject();
  }

  function handleChoice(id: string) {
    if (solved || puzzle.kind !== "choice") return;
    setChoiceId(id);
    if (id === puzzle.correctId) setStatus("correct");
    else reject();
  }

  return (
    <motion.div animate={controls} className="mt-7 sm:mt-8">
      {puzzle.eyebrow ? (
        <p className="text-accent/90 text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
          {puzzle.eyebrow}
        </p>
      ) : null}

      <h3
        id={headingId}
        className={cn(
          "font-display text-xl font-bold tracking-tight sm:text-2xl",
          puzzle.eyebrow && "mt-2",
        )}
      >
        {puzzle.prompt}
      </h3>

      {puzzle.kind === "choice" ? (
        <fieldset
          aria-labelledby={headingId}
          disabled={solved}
          className="mt-5 min-w-0 sm:mt-6"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {puzzle.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                label={choice.label}
                state={
                  solved && choice.id === puzzle.correctId
                    ? "correct"
                    : status === "wrong" && choice.id === choiceId
                      ? "wrong"
                      : "idle"
                }
                onSelect={() => handleChoice(choice.id)}
              />
            ))}
          </div>
        </fieldset>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
          <label htmlFor={inputId} className="sr-only">
            {puzzle.prompt}
          </label>
          <input
            id={inputId}
            type={puzzle.kind === "date" ? "date" : "text"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={solved}
            placeholder={puzzle.kind === "text" ? puzzle.placeholder : undefined}
            autoComplete="off"
            className={cn(
              "min-h-12 w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3",
              "text-foreground placeholder:text-muted/60 text-base [color-scheme:dark]",
              "transition-colors duration-200 outline-none",
              "hover:border-white/20 focus:border-accent/60 focus:bg-white/8",
              "disabled:opacity-60",
            )}
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={solved}
            className="mt-4"
          >
            CHECK ANSWER
          </Button>
        </form>
      )}

      <AnimatePresence mode="wait">
        {solved ? (
          <CorrectFeedback
            key="correct"
            text={puzzle.success}
            continueLabel={continueLabel}
            onContinue={onSolved}
          />
        ) : status === "wrong" ? (
          <WrongFeedback key="wrong" text={puzzle.hint} />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

const CHOICE_STATE_STYLES = {
  idle: "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/8",
  correct: "border-accent/60 bg-accent/12",
  wrong: "border-crimson/60 bg-crimson/12",
} as const;

function ChoiceButton({
  label,
  state,
  onSelect,
}: {
  label: string;
  state: keyof typeof CHOICE_STATE_STYLES;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full touch-manipulation items-center justify-center rounded-2xl border px-4 py-3 text-center",
        "transition-[background-color,border-color,transform] duration-200",
        "hover:bg-white/8 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        CHOICE_STATE_STYLES[state],
      )}
    >
      <span className="font-display text-sm font-semibold tracking-wide sm:text-base">
        {label}
      </span>
    </button>
  );
}

function WrongFeedback({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-live="polite"
      className="border-crimson/30 bg-crimson/10 mt-5 flex items-start gap-3 rounded-2xl border p-4"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT_EXPO }}
    >
      <span aria-hidden className="mt-0.5 text-base leading-none">
        🤔
      </span>
      <p className="text-foreground/90 text-sm sm:text-base">{text}</p>
    </motion.div>
  );
}

function CorrectFeedback({
  text,
  continueLabel,
  onContinue,
}: {
  text: string;
  continueLabel: string;
  onContinue: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-live="polite"
      className="mt-5"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT_EXPO }}
    >
      <div className="border-accent/25 bg-accent/8 flex items-start gap-3 rounded-2xl border p-4 sm:p-5">
        <motion.span
          aria-hidden
          className="bg-accent/15 text-accent mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          <Check className="h-3.5 w-3.5" />
        </motion.span>
        <p className="font-display text-foreground text-base font-semibold sm:text-lg">
          {text}
        </p>
      </div>

      <motion.div
        className="mt-5"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : 0.25,
          ease: EASE_OUT_EXPO,
        }}
      >
        <Button size="lg" fullWidth onClick={onContinue} className="group">
          {continueLabel}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Button>
      </motion.div>
    </motion.div>
  );
}
