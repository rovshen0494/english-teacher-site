"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { WordSet } from "@/content/games/word-sets";
import { shuffle } from "@/lib/shuffle";

interface CardState {
  id: string;
  pairId: string;
  type: "word" | "emoji";
  display: string;
  matched: boolean;
}

const PAIR_COUNT = 8;

function buildCards(wordSet: WordSet): CardState[] {
  const chosen = shuffle(wordSet.words).slice(0, Math.min(PAIR_COUNT, wordSet.words.length));
  const cards: CardState[] = chosen.flatMap((w) => [
    { id: `${w.word}-word`, pairId: w.word, type: "word" as const, display: w.word, matched: false },
    { id: `${w.word}-emoji`, pairId: w.word, type: "emoji" as const, display: w.emoji, matched: false },
  ]);
  return shuffle(cards);
}

export default function MemoryMatchGame({
  wordSet,
  onChangeTopic,
}: {
  wordSet: WordSet;
  onChangeTopic: () => void;
}) {
  const [cards, setCards] = useState<CardState[]>(() => buildCards(wordSet));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const won = cards.length > 0 && cards.every((c) => c.matched);

  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [won]);

  function handleFlip(cardId: string) {
    if (flippedIds.length === 2) return;
    if (flippedIds.includes(cardId)) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.matched) return;

    const nextFlipped = [...flippedIds, cardId];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first && second && first.pairId === second.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c))
          );
          setFlippedIds([]);
        }, 500);
      } else {
        setTimeout(() => setFlippedIds([]), 900);
      }
    }
  }

  function newGame() {
    setCards(buildCards(wordSet));
    setFlippedIds([]);
    setMoves(0);
    setElapsed(0);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3">
        <div className="flex gap-5 text-sm">
          <span>
            <span className="font-semibold text-ink-900">{moves}</span>{" "}
            <span className="text-ink-500">moves</span>
          </span>
          <span>
            <span className="font-semibold text-ink-900">{elapsed}s</span>{" "}
            <span className="text-ink-500">elapsed</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={newGame}
            className="rounded-full border border-ink-100 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-300"
          >
            New Game
          </button>
          <button
            type="button"
            onClick={onChangeTopic}
            className="rounded-full border border-ink-100 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-300"
          >
            Change Topic
          </button>
        </div>
      </div>

      {won ? (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-10 text-center">
          <p className="text-4xl">🎉</p>
          <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">Well done!</h3>
          <p className="mt-1 text-sm text-ink-500">
            You matched all {cards.length / 2} pairs in {moves} moves and {elapsed} seconds.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={newGame}
              className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={onChangeTopic}
              className="rounded-full border border-ink-100 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 hover:border-brand-300"
            >
              Change Topic
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-2.5 sm:gap-3">
          {cards.map((card) => {
            const isFlipped = flippedIds.includes(card.id) || card.matched;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleFlip(card.id)}
                disabled={card.matched}
                className={clsx(
                  "flex aspect-square items-center justify-center rounded-xl border text-center transition-all duration-150",
                  card.matched
                    ? "border-brand-200 bg-brand-50 opacity-60"
                    : isFlipped
                      ? "border-brand-300 bg-white shadow-sm"
                      : "border-ink-100 bg-brand-700 hover:bg-brand-800"
                )}
              >
                {isFlipped ? (
                  <span
                    className={clsx(
                      card.type === "emoji" ? "text-2xl sm:text-3xl" : "text-xs font-semibold text-ink-900 sm:text-sm"
                    )}
                  >
                    {card.display}
                  </span>
                ) : (
                  <span className="text-lg text-white/40">?</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
