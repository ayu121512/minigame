"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";
import { APOLOGY_LETTER, type LetterLine } from "@/lib/letter";

const TOTAL_LINES = APOLOGY_LETTER.length;

/**
 * Reveal pacing: a short base plus a little extra for longer paragraphs, so
 * the letter never drags. The user can always skip with "Read instantly".
 */
function revealDelay(line: LetterLine): number {
  return 220 + Math.min(line.text.length * 3, 420);
}

/**
 * The final apology letter, revealed paragraph by paragraph. Text comes from
 * `lib/letter.ts` and is shown verbatim.
 */
export function LetterScreen() {
  const { goNext } = useGame();
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(0);

  const done = revealed >= TOTAL_LINES;

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(TOTAL_LINES);
      return;
    }
    if (done) return;
    const id = window.setTimeout(
      () => setRevealed((count) => count + 1),
      revealDelay(APOLOGY_LETTER[revealed]),
    );
    return () => window.clearTimeout(id);
  }, [revealed, done, reduceMotion]);

  return (
    <div className="relative flex w-full flex-col">
      {/* Warm, quiet bloom behind the letter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -top-12 -bottom-20 -z-10 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,61,127,0.14)_0%,rgba(255,150,90,0.07)_40%,transparent_72%)]"
      />

      <div className="flex items-center justify-between gap-4">
        <Eyebrow pulse>The Letter</Eyebrow>
        {!done ? (
          <button
            type="button"
            onClick={() => setRevealed(TOTAL_LINES)}
            className="text-muted hover:text-foreground inline-flex touch-manipulation items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/6"
          >
            <Zap aria-hidden className="h-3.5 w-3.5" />
            Read instantly
          </button>
        ) : null}
      </div>

      <article
        className={cn(
          "mt-5 w-full rounded-[1.75rem] border border-amber-100/10",
          "bg-gradient-to-b from-white/6 to-white/2 px-6 py-9 backdrop-blur-xl sm:px-10 sm:py-12",
          "shadow-[0_30px_90px_-50px_rgba(255,61,127,0.6)]",
        )}
      >
        <div className="space-y-5 sm:space-y-6">
          {APOLOGY_LETTER.map((line, index) => (
            <LetterParagraph
              key={index}
              line={line}
              revealed={index < revealed}
              caret={index === revealed - 1 && !done}
            />
          ))}
        </div>
      </article>

      {done ? (
        <motion.div
          className="mt-8"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT_EXPO }}
        >
          <Button size="lg" fullWidth onClick={goNext} className="group">
            CONTINUE
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
}

function LetterParagraph({
  line,
  revealed,
  caret,
}: {
  line: LetterLine;
  revealed: boolean;
  caret: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const isGreeting = line.tone === "greeting";
  const isSignature = line.tone === "signature";

  return (
    <motion.p
      initial={false}
      animate={
        revealed
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 10, filter: "blur(4px)" }
      }
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT_EXPO }}
      className={cn(
        "text-base leading-relaxed sm:text-lg sm:leading-relaxed",
        isGreeting &&
          "font-display text-foreground text-xl font-semibold sm:text-2xl",
        isSignature &&
          "font-display text-accent pt-1 text-right text-lg font-semibold sm:text-xl",
        !isGreeting && !isSignature && "text-[#f0e7de]",
      )}
    >
      {line.text}
      {caret ? <Caret /> : null}
    </motion.p>
  );
}

/** Blinking cursor that sits at the end of the line being revealed. */
function Caret() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className="bg-accent/80 ml-1 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-full"
      animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.5, 0.5, 1],
      }}
    />
  );
}
