"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { AnimatedText } from "@/components/ui/AnimatedText";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";

/**
 * Reveal beats in seconds, measured from mount. The opening stays cinematic
 * but reaches an interactive button in under 4 seconds.
 */
const BEAT = {
  missionLine: 0.5,
  title: 2.2,
  titleStagger: 0.15,
  subtitle: 3.3,
  action: 3.9,
} as const;

const MISSION_LINE = "A VERY IMPORTANT MISSION...";
const TITLE_WORDS = ["MAKE", "KARUNA", "SMILE"] as const;
const SUBTITLE = "A tiny mission prepared by Sufiyan ❤️";

/**
 * The cinematic opening. Starts on a near-black veil (raised by the shell),
 * reveals an intro line, then the title lockup, subtitle, and finally the
 * call to action. Every beat is declarative — no timers, no layout shift.
 */
export function LandingScreen() {
  const { goNext } = useGame();
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center text-center">
      {/* Reserved slot so the later beats never shift the composition. */}
      <div className="flex h-6 items-center justify-center">
        {reduceMotion ? null : (
          <motion.p
            aria-hidden
            className="text-muted text-[0.6rem] font-semibold tracking-[0.4em] uppercase sm:text-xs"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [8, 0, 0, -8],
              // Discrete switch keeps the faded line out of the a11y tree
              // while still holding its space in the layout.
              visibility: ["visible", "visible", "visible", "hidden"],
            }}
            transition={{
              duration: 1.7,
              times: [0, 0.3, 0.7, 1],
              delay: BEAT.missionLine,
              ease: "easeInOut",
            }}
          >
            {MISSION_LINE}
          </motion.p>
        )}
      </div>

      <motion.h1
        aria-label={TITLE_WORDS.join(" ")}
        className="mt-1 flex flex-col items-center"
      >
        <HeroLine
          text={TITLE_WORDS[0]}
          delay={BEAT.title}
          className="text-foreground/75 mr-[-0.5em] text-base font-semibold tracking-[0.5em] sm:text-xl"
        />
        <HeroLine
          text={TITLE_WORDS[1]}
          delay={BEAT.title + BEAT.titleStagger}
          className="text-hero text-glow text-foreground mt-2 font-extrabold sm:mt-3"
        />
        <HeroLine
          text={TITLE_WORDS[2]}
          delay={BEAT.title + BEAT.titleStagger * 2}
          className="text-foreground/75 mr-[-0.5em] mt-2 text-base font-semibold tracking-[0.5em] sm:mt-3 sm:text-xl"
        />
      </motion.h1>

      <AnimatedText
        text={SUBTITLE}
        className="text-muted mt-7 text-sm sm:text-base"
        delay={reduceMotion ? 0 : BEAT.subtitle}
        stagger={0.04}
      />

      <motion.div
        className="mt-9"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.6,
          delay: reduceMotion ? 0 : BEAT.action,
          ease: EASE_OUT_EXPO,
        }}
      >
        <Button size="lg" onClick={goNext} className="group">
          START THE MISSION
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Button>
      </motion.div>
    </div>
  );
}

/** One line of the title lockup: a soft rise out of blur. */
function HeroLine({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={cn("block whitespace-nowrap", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 26, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: reduceMotion ? 0 : 0.9,
        delay: reduceMotion ? 0 : delay,
        ease: EASE_OUT_EXPO,
      }}
    >
      {text}
    </motion.span>
  );
}
