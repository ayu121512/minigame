"use client";

import { motion, useReducedMotion } from "motion/react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";

/** Deterministic floating hearts so the effect stays calm and consistent. */
const HEARTS = [
  { left: 10, size: 13, delay: 0, duration: 8, drift: 16 },
  { left: 22, size: 10, delay: 1.6, duration: 9.5, drift: -14 },
  { left: 34, size: 12, delay: 0.8, duration: 8.5, drift: 12 },
  { left: 46, size: 9, delay: 2.4, duration: 10, drift: -18 },
  { left: 58, size: 13, delay: 0.4, duration: 9, drift: 15 },
  { left: 70, size: 10, delay: 1.9, duration: 8.8, drift: -12 },
  { left: 82, size: 12, delay: 1.1, duration: 9.6, drift: 14 },
  { left: 91, size: 9, delay: 2.8, duration: 10.4, drift: -16 },
] as const;

interface StatusRowData {
  readonly label: string;
  readonly value: string;
  readonly accent?: boolean;
}

const STATUS_ROWS: readonly StatusRowData[] = [
  { label: "Mission status", value: "SUCCESSFUL", accent: true },
  { label: "Karuna's smile", value: "Hopefully restored :)" },
];

/**
 * The final cinematic moment. Warm, celebratory, and complete on its own —
 * there is no further action to take.
 */
export function SuccessScreen() {
  const reduceMotion = useReducedMotion();

  return (
    <GlassCard glow padding="lg">
      <div className="relative">
        {/* Warm bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-12 -bottom-16 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,61,127,0.18)_0%,rgba(255,150,90,0.08)_42%,transparent_74%)]"
        />
        <FloatingHearts />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Eyebrow pulse>Mission Success</Eyebrow>

          <motion.h1
            className="text-glow font-display text-foreground mt-5 text-[clamp(2.25rem,9vw,4.25rem)] leading-[1.02] font-extrabold tracking-tight break-words"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              delay: reduceMotion ? 0 : 0.15,
              ease: EASE_OUT_EXPO,
            }}
          >
            SMILE DETECTED ❤️
          </motion.h1>

          <dl className="mt-9 w-full max-w-sm divide-y divide-white/8 border-y border-white/8 text-left">
            {STATUS_ROWS.map((row, index) => (
              <StatusRow key={row.label} row={row} index={index} />
            ))}
          </dl>

          <motion.p
            className="text-muted mt-9 text-base sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 1,
              ease: EASE_OUT_EXPO,
            }}
          >
            Thank you for making it till the end. 🥹
          </motion.p>

          <motion.p
            className="font-display text-foreground/80 mt-6 text-sm font-semibold tracking-wide"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 1.25,
              ease: EASE_OUT_EXPO,
            }}
          >
            Made with ❤️ by Sufiyan
          </motion.p>
        </div>
      </div>
    </GlassCard>
  );
}

function StatusRow({ row, index }: { row: StatusRowData; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : 0.5 + index * 0.15,
        ease: EASE_OUT_EXPO,
      }}
    >
      <dt className="text-muted text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
        {row.label}
      </dt>
      <dd
        className={cn(
          "font-display text-base font-semibold sm:text-lg",
          row.accent ? "text-accent" : "text-foreground",
        )}
      >
        {row.value}
      </dd>
    </motion.div>
  );
}

/** A few slow, faint hearts drifting upward. */
function FloatingHearts() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {HEARTS.map((heart, index) => (
        <motion.span
          key={index}
          className="absolute bottom-0 select-none"
          style={{ left: `${heart.left}%`, fontSize: heart.size }}
          initial={{ y: 30, x: 0, opacity: 0 }}
          animate={{
            y: [10, -180],
            x: [0, heart.drift, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}
