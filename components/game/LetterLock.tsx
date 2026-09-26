"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useGame } from "@/components/game/GameShell";
import { EASE_OUT_EXPO } from "@/lib/animation";

/** How long the opening animation plays before the letter screen takes over. */
const OPEN_DELAY_MS = 2000;

/** Fixed particle field — deterministic so server and client markup agree. */
const PARTICLES = [
  { left: "6%", top: "78%", size: 4, duration: 9, delay: 0 },
  { left: "16%", top: "62%", size: 3, duration: 11, delay: 1.4 },
  { left: "26%", top: "85%", size: 5, duration: 10, delay: 2.6 },
  { left: "37%", top: "70%", size: 3, duration: 13, delay: 0.7 },
  { left: "48%", top: "88%", size: 4, duration: 9.5, delay: 3.2 },
  { left: "58%", top: "66%", size: 3, duration: 12, delay: 1.9 },
  { left: "69%", top: "83%", size: 4, duration: 10.5, delay: 0.4 },
  { left: "79%", top: "72%", size: 3, duration: 11.5, delay: 2.2 },
  { left: "88%", top: "86%", size: 5, duration: 9, delay: 1.1 },
  { left: "93%", top: "58%", size: 3, duration: 12.5, delay: 3.6 },
  { left: "8%", top: "40%", size: 3, duration: 13.5, delay: 2.9 },
  { left: "90%", top: "36%", size: 4, duration: 10, delay: 4.1 },
] as const;

/**
 * The letter lock: a warm, glowing envelope that Karuna can open. The letter
 * itself stays hidden here — opening unlocks it and hands over to the letter
 * screen.
 */
export function LetterLock() {
  const { unlockLetter, goNext } = useGame();
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);

  // Once opened, let the animation breathe, then move into the letter screen.
  useEffect(() => {
    if (!opened) return;
    const id = window.setTimeout(
      () => goNext(),
      reduceMotion ? 420 : OPEN_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [opened, reduceMotion, goNext]);

  function handleOpen() {
    if (opened) return;
    unlockLetter();
    setOpened(true);
  }

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Warm dark wash with a soft pink bloom rising from below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-16 -z-10 bg-[radial-gradient(120%_80%_at_50%_115%,rgba(255,61,127,0.22)_0%,rgba(255,138,76,0.10)_38%,transparent_72%)]"
      />
      <Particles />

      <Eyebrow pulse>Letter Lock</Eyebrow>

      <h2 className="text-title mt-4">You&apos;ve unlocked something...</h2>

      <Envelope opened={opened} />

      <p className="text-muted mt-8 text-sm sm:text-base">
        A message from your duffer.
      </p>

      <div className="mt-6 w-full max-w-xs">
        <AnimatePresence mode="wait" initial={false}>
          {opened ? (
            <motion.p
              key="opening"
              className="text-accent/90 font-display text-sm font-semibold tracking-wide"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              Opening your letter...
            </motion.p>
          ) : (
            <motion.div
              key="button"
              initial={false}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <Button
                size="lg"
                fullWidth
                onClick={handleOpen}
                className="group"
              >
                OPEN LETTER 💌
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Particles() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="bg-accent/50 absolute rounded-full blur-[1px]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ y: [0, -80, 0], opacity: [0, 0.8, 0] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** The envelope: back, rising letter sheet, front pocket, and opening flap. */
function Envelope({ opened }: { opened: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mt-9 w-full max-w-[18rem] sm:max-w-[21rem]">
      {/* Pink glow that swells as the envelope opens. */}
      <motion.div
        aria-hidden
        className="from-accent/35 pointer-events-none absolute -inset-12 -z-10 rounded-full bg-gradient-to-b via-fuchsia-500/10 to-transparent blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: opened ? [0.7, 1, 0.85] : [0.45, 0.62, 0.45] }
        }
        transition={
          opened
            ? { duration: 1.4, ease: "easeInOut" }
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.div
        className="relative aspect-[3/2] w-full"
        animate={reduceMotion ? undefined : { y: opened ? -6 : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      >
        {/* Envelope back */}
        <div className="absolute inset-0 rounded-[1.4rem] border border-amber-100/15 bg-gradient-to-br from-[#40263a] via-[#301c2b] to-[#211320] shadow-[0_30px_90px_-38px_rgba(255,61,127,0.75)]" />

        {/* Letter sheet that rises out once opened. */}
        <motion.div
          className="absolute top-[10%] left-1/2 h-[88%] w-[84%] -translate-x-1/2 overflow-hidden rounded-lg bg-gradient-to-b from-[#fdf7ef] to-[#efe0cf] shadow-[0_12px_30px_-14px_rgba(0,0,0,0.7)]"
          initial={false}
          animate={
            reduceMotion
              ? { opacity: opened ? 1 : 0 }
              : { y: opened ? -32 : 8, opacity: opened ? 1 : 0 }
          }
          transition={{
            duration: 0.7,
            delay: opened ? 0.45 : 0,
            ease: EASE_OUT_EXPO,
          }}
        >
          <div className="mt-[30%] space-y-2 px-5">
            <span className="bg-[#e2b7c6] block h-1.5 w-2/5 rounded-full" />
            <span className="bg-[#ddc9b8] block h-1 w-full rounded-full" />
            <span className="bg-[#ddc9b8] block h-1 w-11/12 rounded-full" />
            <span className="bg-[#ddc9b8] block h-1 w-3/5 rounded-full" />
          </div>
        </motion.div>

        {/* Front pocket (the classic V) */}
        <div
          className="absolute inset-0 rounded-[1.4rem] bg-gradient-to-b from-[#4b2c3f] to-[#2c1a27]"
          style={{
            clipPath: "polygon(0 100%, 0 32%, 50% 80%, 100% 32%, 100% 100%)",
          }}
        />

        {/* Address */}
        <div className="absolute inset-x-0 bottom-[14%] flex justify-center">
          <span className="font-display text-base font-bold tracking-[0.35em] text-amber-50/95 uppercase sm:text-lg">
            For Karuna
          </span>
        </div>

        {/* Flap, folded down when sealed and lifting up when opened. */}
        <motion.div
          className="absolute top-0 left-0 h-[64%] w-full"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backgroundImage:
              "linear-gradient(to bottom, #553449 0%, #361f2e 100%)",
            transformPerspective: 900,
            transformOrigin: "top center",
          }}
          initial={false}
          animate={{ rotateX: opened ? -168 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.75,
            ease: EASE_OUT_EXPO,
          }}
        />
      </motion.div>
    </div>
  );
}
