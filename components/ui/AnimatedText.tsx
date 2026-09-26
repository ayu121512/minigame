"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

/** Shared easing so every staged reveal feels like one system. */
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface AnimatedTextProps {
  /** Text to reveal. Use "\n" to force line breaks. */
  text: string;
  /** Element wrapper, e.g. "h1", "h2", "p". Defaults to "p". */
  as?: ElementType;
  className?: string;
  /** Seconds before the first word appears. */
  delay?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
  /** Duration of each word's reveal, in seconds. */
  duration?: number;
}

interface Word {
  readonly text: string;
  /** Position in the full text, used to stagger across lines. */
  readonly order: number;
}

/**
 * Reveals text word by word with a staggered fade/slide/blur.
 * Honours `prefers-reduced-motion` by rendering the text immediately.
 */
export function AnimatedText({
  text,
  as: Component = "p",
  className,
  delay = 0,
  stagger = 0.045,
  duration = 0.6,
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();

  const lines = useMemo<readonly (readonly Word[])[]>(() => {
    let order = 0;
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) =>
        line.split(/\s+/).map<Word>((word) => ({ text: word, order: order++ })),
      );
  }, [text]);

  return (
    <Component className={className}>
      {lines.map((words, lineIndex) => (
        <span key={lineIndex} className="block">
          {words.map((word, wordIndex) => (
            <span key={`${lineIndex}-${wordIndex}`}>
              <motion.span
                className="inline-block will-change-transform"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 14, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: reduceMotion ? 0 : duration,
                  delay: reduceMotion ? 0 : delay + word.order * stagger,
                  ease: EASE_OUT_EXPO,
                }}
              >
                {word.text}
              </motion.span>
              {/* Real space node keeps wrapping and screen readers natural. */}
              {wordIndex < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
}

/** Convenience wrapper for text that sits inside a styled paragraph. */
export function AnimatedParagraph({
  className,
  ...props
}: AnimatedTextProps) {
  return (
    <AnimatedText
      className={cn("text-muted leading-relaxed", className)}
      {...props}
    />
  );
}
