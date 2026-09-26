/**
 * Puzzle Room content for "The Bestie Test".
 *
 * Data lives here so the PuzzleCard / PuzzleRoom components stay presentational
 * and every answer, hint, and response is edited in one place.
 */

/** Expected answer shape, used to pick the right input to render. */
export type PuzzleKind = "text" | "date" | "choice";

export interface PuzzleChoice {
  readonly id: string;
  readonly label: string;
}

interface PuzzleBase {
  readonly id: string;
  /** The question shown as the card heading. */
  readonly prompt: string;
  /** Optional small label above the prompt, e.g. "One last question...". */
  readonly eyebrow?: string;
  /** Clue shown after a wrong attempt. Helpful, never insulting. */
  readonly hint: string;
  /** Shown after the answer is accepted. */
  readonly success: string;
}

export interface TextPuzzle extends PuzzleBase {
  readonly kind: "text";
  readonly placeholder: string;
  /** Accepted answers, already normalised (trimmed + lowercased). */
  readonly answers: readonly string[];
}

export interface DatePuzzle extends PuzzleBase {
  readonly kind: "date";
  /** Expected value in ISO `yyyy-mm-dd` (native date input format). */
  readonly answer: string;
}

export interface ChoicePuzzle extends PuzzleBase {
  readonly kind: "choice";
  readonly choices: readonly PuzzleChoice[];
  readonly correctId: string;
}

export type Puzzle = TextPuzzle | DatePuzzle | ChoicePuzzle;

/** The one normalisation the text puzzles use: trim, then lowercase. */
export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Check a submitted answer for a text or date puzzle. Choice puzzles are
 * compared by id, so they are excluded here.
 */
export function isAnswerCorrect(
  puzzle: TextPuzzle | DatePuzzle,
  value: string,
): boolean {
  return puzzle.kind === "text"
    ? puzzle.answers.includes(normalizeAnswer(value))
    : value === puzzle.answer;
}

/** The five levels, in the order Karuna plays them. */
export const PUZZLES: readonly Puzzle[] = [
  {
    id: "name",
    kind: "text",
    prompt: "Tell me my name 👀",
    placeholder: "Type your answer...",
    answers: ["sufiyan"],
    hint: "Psst... it's the name on the mission briefing. 😌",
    success: "At least mera naam toh yaad hai. 😭❤️",
  },
  {
    id: "birthday",
    kind: "date",
    prompt: "When was I born? 🎂",
    answer: "2005-04-05",
    hint: "A very important day in April 2005. 📅",
    success: "Okay... memory is working. 👀",
  },
  {
    id: "chinese-food",
    kind: "choice",
    prompt: "My favourite Chinese food? 🍚",
    choices: [
      { id: "momos", label: "Momos 🥟" },
      { id: "chowmein", label: "Chowmein 🍜" },
      { id: "chicken-rice", label: "Chicken Rice 🍚" },
      { id: "manchurian", label: "Manchurian 🥘" },
    ],
    correctId: "chicken-rice",
    hint: "Not the dumplings, not the noodles... think rice. 🍚",
    success: "Respect. You know your duffer. 😂",
  },
  {
    id: "cold-drink",
    kind: "choice",
    prompt: "My favourite cold drink? 🥤",
    choices: [
      { id: "coke", label: "Coke" },
      { id: "pepsi", label: "Pepsi" },
      { id: "sprite", label: "Sprite" },
      { id: "diet-coke", label: "Diet Coke" },
    ],
    correctId: "diet-coke",
    hint: "The one that pretends to be the healthy option. 😏",
    success: "Certified bestie knowledge unlocked. 🫡",
  },
  {
    id: "feelings",
    kind: "choice",
    eyebrow: "One last question...",
    prompt: "What kind of feelings do I have for you?",
    choices: [
      { id: "friendship", label: "Friendship 🤝" },
      { id: "respect", label: "Respect ❤️" },
      { id: "love", label: "Love ❤️‍🔥" },
      { id: "all-of-the-above", label: "All of the above" },
    ],
    correctId: "love",
    hint: "Close... but only one of these is exactly right. 🫣",
    success: "Answer accepted.",
  },
];
