"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";

import { Confetti } from "@/components/game/Confetti";
import { FinalNote } from "@/components/game/FinalNote";
import { LandingScreen } from "@/components/game/LandingScreen";
import { LetterLock } from "@/components/game/LetterLock";
import { LetterScreen } from "@/components/game/LetterScreen";
import { MissionIntro } from "@/components/game/MissionIntro";
import { MoodCheck } from "@/components/game/MoodCheck";
import { ProgressBar } from "@/components/game/ProgressBar";
import { PuzzleRoom } from "@/components/game/PuzzleRoom";
import { SuccessScreen } from "@/components/game/SuccessScreen";
import { WarmUp } from "@/components/game/WarmUp";
import { EASE_OUT_EXPO } from "@/lib/animation";
import { cn } from "@/lib/cn";
import { AnimatedParagraph } from "@/components/ui/AnimatedText";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  INITIAL_GAME_STATE,
  STAGE_META,
  STAGE_ORDER,
  TOTAL_PUZZLES,
  type GameStage,
  type GameState,
  type MoodId,
} from "@/lib/game";

/** Everything after the Puzzle Room stays locked until the puzzles are solved. */
const PUZZLES_STAGE_INDEX = STAGE_ORDER.indexOf("puzzles");
const LETTER_STAGE_INDEX = STAGE_ORDER.indexOf("letter");

/**
 * Guard against reaching a stage out of order. The envelope and the letter can
 * only be entered once all five puzzles are done (and the letter itself only
 * after the envelope has been opened).
 */
function canEnterStage(target: GameStage, state: GameState): boolean {
  const index = STAGE_ORDER.indexOf(target);
  if (index <= PUZZLES_STAGE_INDEX) return true;
  if (state.completedPuzzles.length < TOTAL_PUZZLES) return false;
  if (index >= LETTER_STAGE_INDEX && !state.letterUnlocked) return false;
  return true;
}

export interface GameContextValue extends GameState {
  stageIndex: number;
  totalStages: number;
  setStage: (stage: GameStage) => void;
  setMood: (mood: MoodId) => void;
  /** Record a solved puzzle so later stages can unlock. */
  solvePuzzle: (id: string) => void;
  /** Mark the envelope as opened, unlocking the letter. */
  unlockLetter: () => void;
  goNext: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Read and update the shared game state from any stage component. */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside <GameShell>.");
  }
  return context;
}

/** Owns the whole experience: state, provider, and the persistent frame. */
export function GameShell() {
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);

  const setStage = useCallback((stage: GameStage) => {
    setState((previous) => {
      if (previous.stage === stage) return previous;
      if (!canEnterStage(stage, previous)) return previous;
      return { ...previous, stage };
    });
  }, []);

  const goNext = useCallback(() => {
    setState((previous) => {
      const index = STAGE_ORDER.indexOf(previous.stage);
      const nextStage = STAGE_ORDER[
        Math.min(index + 1, STAGE_ORDER.length - 1)
      ] as GameStage;
      if (nextStage === previous.stage) return previous;
      if (!canEnterStage(nextStage, previous)) return previous;
      return { ...previous, stage: nextStage };
    });
  }, []);

  const setMood = useCallback((mood: MoodId) => {
    setState((previous) =>
      previous.mood === mood ? previous : { ...previous, mood },
    );
  }, []);

  const solvePuzzle = useCallback((id: string) => {
    setState((previous) => {
      if (previous.completedPuzzles.includes(id)) return previous;
      const completedPuzzles = [...previous.completedPuzzles, id];
      return {
        ...previous,
        completedPuzzles,
        puzzleIndex: Math.min(completedPuzzles.length, TOTAL_PUZZLES - 1),
      };
    });
  }, []);

  const unlockLetter = useCallback(() => {
    setState((previous) =>
      previous.letterUnlocked ? previous : { ...previous, letterUnlocked: true },
    );
  }, []);

  const reset = useCallback(() => setState(INITIAL_GAME_STATE), []);

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      stageIndex: STAGE_ORDER.indexOf(state.stage),
      totalStages: STAGE_ORDER.length,
      setStage,
      setMood,
      solvePuzzle,
      unlockLetter,
      goNext,
      reset,
    }),
    [state, setStage, setMood, solvePuzzle, unlockLetter, goNext, reset],
  );

  return (
    <GameContext.Provider value={value}>
      <GameFrame />
    </GameContext.Provider>
  );
}

/** Persistent chrome: background, header, progress, stage slot, footer. */
function GameFrame() {
  const { stage, stageIndex, totalStages, reset } = useGame();
  const reduceMotion = useReducedMotion();
  const isIntro = stage === "intro";

  return (
    <div className="relative flex min-h-dvh flex-col">
      <BackgroundEffects />

      {/*
        Opening beat: a black veil that lifts once to reveal the ambient
        background. It lives in the shell rather than the landing screen
        because the stage transition animates `filter`, which would trap a
        fixed-position child inside the centred column.
      */}
      {isIntro && !reduceMotion ? (
        <motion.div
          aria-hidden
          className="bg-void pointer-events-none fixed inset-0 z-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
        />
      ) : null}

      {/*
        Celebration burst. It lives in the shell (outside the stage
        transition) because the transition animates `filter`, which would trap
        a fixed-position child inside the centred column.
      */}
      {stage === "success" ? <Confetti /> : null}

      {/* Chrome stays mounted (no layout shift) but hides for the landing. */}
      <header
        aria-hidden={isIntro}
        className={cn(
          "relative z-10 pt-7 transition-opacity duration-500 sm:pt-9",
          isIntro && "pointer-events-none opacity-0",
        )}
      >
        <Container>
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted text-[0.65rem] font-semibold tracking-[0.4em] uppercase">
              Make Karuna Smile
            </p>
            <button
              type="button"
              onClick={reset}
              aria-label="Restart the experience"
              className="text-muted hover:text-foreground inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full transition-colors hover:bg-white/8"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <ProgressBar
            current={stageIndex}
            total={totalStages}
            className="mt-5"
          />
        </Container>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center py-10 sm:py-14">
        <Container size="narrow">
          <AnimatePresence mode="wait" initial={false}>
            <StageTransition key={stage}>
              <StageScreen stage={stage} />
            </StageTransition>
          </AnimatePresence>
        </Container>
      </main>

      <footer className="relative z-10 pb-8">
        <Container size="narrow">
          <p className="text-muted/70 text-center text-xs">
            Made with ❤️ by Sufiyan
          </p>
        </Container>
      </footer>
    </div>
  );
}

/** Real screens, keyed by stage. Any stage without an entry shows a placeholder. */
const STAGE_SCREENS: Partial<Record<GameStage, ComponentType>> = {
  intro: LandingScreen,
  mission: MissionIntro,
  mood: MoodCheck,
  fun: WarmUp,
  puzzles: PuzzleRoom,
  "letter-lock": LetterLock,
  letter: LetterScreen,
  final: FinalNote,
  success: SuccessScreen,
};

function StageScreen({ stage }: { stage: GameStage }) {
  const Screen = STAGE_SCREENS[stage];
  return Screen ? <Screen /> : <StagePlaceholder stage={stage} />;
}

/** Enter/exit animation shared by every screen in the stage slot. */
function StageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT_EXPO }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Defensive fallback for a stage without a registered screen. Every stage now
 * has a real screen, so this should never render.
 */
function StagePlaceholder({ stage }: { stage: GameStage }) {
  const { stageIndex, totalStages, goNext } = useGame();
  const meta = STAGE_META[stage];
  const isLastStage = stageIndex === totalStages - 1;

  return (
    <GlassCard glow padding="lg">
      <StageEyebrow index={stageIndex} total={totalStages} />
      <h1 className="text-title mt-4">{meta.label}</h1>
      <AnimatedParagraph
        className="mt-3 text-sm sm:text-base"
        text={meta.hint}
        delay={0.08}
        stagger={0.018}
      />
      <p className="text-muted/60 mt-6 font-mono text-[0.7rem]">
        stage: {stage}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={goNext} disabled={isLastStage} fullWidth>
          {isLastStage ? "End of mission" : "Continue →"}
        </Button>
      </div>
    </GlassCard>
  );
}

function StageEyebrow({ index, total }: { index: number; total: number }) {
  const label = `Stage ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  return (
    <p className="text-accent/90 text-[0.65rem] font-semibold tracking-[0.35em] uppercase">
      {label}
    </p>
  );
}
