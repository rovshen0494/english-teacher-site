"use client";

import { useState, type ComponentType } from "react";
import TopicPicker from "./TopicPicker";
import MemoryMatchGame from "./MemoryMatchGame";
import WordScrambleGame from "./WordScrambleGame";
import VocabQuizGame from "./VocabQuizGame";
import type { WordSet } from "@/content/games/word-sets";
import type { GameType } from "@/lib/games";

interface GameProps {
  wordSet: WordSet;
  onChangeTopic: () => void;
}

const GAME_COMPONENTS: Record<GameType, ComponentType<GameProps>> = {
  "memory-match": MemoryMatchGame,
  "word-scramble": WordScrambleGame,
  "vocabulary-quiz": VocabQuizGame,
};

export default function GamePlayer({
  gameType,
  wordSets,
  initialTopic,
}: {
  gameType: GameType;
  wordSets: WordSet[];
  initialTopic?: string;
}) {
  const initial = wordSets.find((s) => s.slug === initialTopic) ?? null;
  const [topic, setTopic] = useState<WordSet | null>(initial);

  if (!topic) {
    return <TopicPicker wordSets={wordSets} onSelect={setTopic} />;
  }

  const GameComponent = GAME_COMPONENTS[gameType];
  return <GameComponent wordSet={topic} onChangeTopic={() => setTopic(null)} />;
}
