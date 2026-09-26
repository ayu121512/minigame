/**
 * The final apology letter.
 *
 * ⚠️ The text below is intentional and must be preserved EXACTLY: no rewrites,
 * grammar corrections, translations, punctuation changes, or signature edits.
 */

export type LetterTone = "greeting" | "body" | "signature";

export interface LetterLine {
  readonly text: string;
  readonly tone: LetterTone;
}

export const APOLOGY_LETTER: readonly LetterLine[] = [
  { tone: "greeting", text: "💌 Dear Karuna," },
  {
    tone: "body",
    text: "Mujhe samajh aa raha hai ki tujhe actually kis baat ka bura laga, aur honestly uske baad se mujhe bhi realise ho raha hai ki meri galti thi.",
  },
  {
    tone: "body",
    text: "Jab us time meri Ashka se baat ho rahi thi, maine tujhe usi time share nahi kiya. Shayad mere liye woh ek normal si baat thi, isliye maine us waqt itna nahi socha. Lekin ab mujhe samajh aa raha hai ki tujhe bura isliye laga kyunki tu mujhse cheezein instantly share karti hai, aur tu expect karti thi ki main bhi tere saath waise hi open rahunga.",
  },
  {
    tone: "body",
    text: "Aur honestly, main teri jagah hota toh shayad mujhe bhi bura lagta.",
  },
  {
    tone: "body",
    text: "Mera tujhe kuch hide karne ka intention nahi tha, na hi main tujhe intentionally exclude karna chahta tha. But phir bhi, maine tujhe us waqt nahi bataya, aur usse tujhe hurt hua — uske liye I'm genuinely sorry.",
  },
  {
    tone: "body",
    text: "Mujhe pata hai sirf sorry bolne se woh feeling immediately theek nahi hogi, but main itna zaroor kehna chahta hu ki aage se main aisi cheez repeat nahi karunga.",
  },
  {
    tone: "body",
    text: "Tu mujhse itna kuch share karti hai aur mujhpe trust karti hai, toh mujhe bhi us trust ki value samajhni chahiye.",
  },
  { tone: "body", text: "I'm really sorry, Karuna. ❤️" },
  {
    tone: "body",
    text: "Mera intention kabhi tujhe hurt karna nahi tha, but I understand ki meri actions se tujhe bura laga.",
  },
  {
    tone: "body",
    text: "I hope tu mujhe samjhegi aur eventually maaf kar degi.",
  },
  { tone: "signature", text: "— Your duffer ❤️" },
];
