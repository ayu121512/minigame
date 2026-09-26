/**
 * Central game model for the "Make Karuna Smile" experience.
 *
 * The whole journey lives on one route and moves through these stages in order.
 * Content and types live here so components stay presentational.
 */

/** Every screen the experience can be in. */
export type GameStage =
  | "intro"
  | "mission"
  | "mood"
  | "fun"
  | "puzzles"
  | "letter-lock"
  | "letter"
  | "final"
  | "success";

/** Canonical stage order — drives progress and "next stage" navigation. */
export const STAGE_ORDER: readonly GameStage[] = [
  "intro",
  "mission",
  "mood",
  "fun",
  "puzzles",
  "letter-lock",
  "letter",
  "final",
  "success",
];

/** Number of puzzle levels in the Puzzle Room. */
export const TOTAL_PUZZLES = 5;

/** How angry Karuna says she is, from the Mood Check. */
export type MoodId = "very-angry" | "little" | "not-much" | "fine";

/** Label + description shown in the shell's progress header. */
export interface StageMeta {
  readonly label: string;
  readonly hint: string;
}

export const STAGE_META: Readonly<Record<GameStage, StageMeta>> = {
  intro: {
    label: "Landing",
    hint: "Cinematic opening: MAKE KARUNA SMILE fades in.",
  },
  mission: {
    label: "Mission Briefing",
    hint: "Game-style objective card with an ACCEPT MISSION action.",
  },
  mood: {
    label: "Mood Check",
    hint: "Karuna picks her current anger level and gets a funny response.",
  },
  fun: {
    label: "Warm-Up",
    hint: "Playful interactions, including the runaway LEAVE button.",
  },
  puzzles: {
    label: "Puzzle Room",
    hint: "Five levels of bestie trivia with retries and progress.",
  },
  "letter-lock": {
    label: "Letter Lock",
    hint: "The sealed envelope waiting to be opened.",
  },
  letter: {
    label: "The Letter",
    hint: "The apology letter, revealed line by line.",
  },
  final: {
    label: "Final Note",
    hint: "Closing words and a single I UNDERSTAND action.",
  },
  success: {
    label: "Mission Success",
    hint: "Confetti, SMILE DETECTED, and the end of the mission.",
  },
};

/** Everything the experience needs to track while it runs. */
export interface GameState {
  stage: GameStage;
  /** Zero-based index into the puzzle list. */
  puzzleIndex: number;
  /** Ids of the puzzles Karuna already solved. */
  completedPuzzles: readonly string[];
  /** Null until the Mood Check is answered. */
  mood: MoodId | null;
  letterUnlocked: boolean;
  finalCompleted: boolean;
}

export const INITIAL_GAME_STATE: GameState = {
  stage: "intro",
  puzzleIndex: 0,
  completedPuzzles: [],
  mood: null,
  letterUnlocked: false,
  finalCompleted: false,
};
