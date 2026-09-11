export type GameType = "memory-match" | "word-scramble" | "vocabulary-quiz";

export interface GameMeta {
  slug: GameType;
  title: string;
  description: string;
  emoji: string;
  skill: string;
}

export const GAMES: GameMeta[] = [
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Flip cards to match each word with its picture. Great for visual vocabulary practice.",
    emoji: "🧠",
    skill: "Vocabulary",
  },
  {
    slug: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble the letters to spell each word correctly. Builds spelling and vocabulary recall.",
    emoji: "🔤",
    skill: "Spelling & Vocabulary",
  },
  {
    slug: "vocabulary-quiz",
    title: "Vocabulary Quiz",
    description: "Choose the correct word for each picture across a set of quick-fire questions.",
    emoji: "❓",
    skill: "Vocabulary",
  },
];

export function getGameMeta(slug: string): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}
