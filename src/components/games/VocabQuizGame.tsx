"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { GameWord, WordSet } from "@/content/games/word-sets";
import { shuffle } from "@/lib/shuffle";

function buildOptions(correct: GameWord, allWords: GameWord[]): GameWord[] {
  const distractors = shuffle(allWords.filter((w) => w.word !== correct.word)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

export default function VocabQuizGame({
  wordSet,
  onChangeTopic,
}: {
  wordSet: WordSet;
  onChangeTopic: () => void;
}) {
  const [order, setOrder] = useState<GameWord[]>(() => shuffle(wordSet.words));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const finished = index >= order.length;
  const current = !finished ? order[index] : null;
  const options = useMemo(() => (current ? buildOptions(current, wordSet.words) : []), [current, wordSet.words]);

  function selectOption(word: GameWord) {
    if (answered || !current) return;
    setSelected(word.word);
    setAnswered(true);
    if (word.word === current.word) setScore((s) => s + 10);
  }

  function next() {
    setSelected(null);
    setAnswered(false);
    setIndex((i) => i + 1);
  }

  function playAgain() {
    setOrder(shuffle(wordSet.words));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
  }

  if (finished) {
    const total = order.length * 10;
    const percent = Math.round((score / total) * 100);
    const message = percent >= 80 ? "Excellent work!" : percent >= 50 ? "Good effort!" : "Keep practising!";
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-10 text-center">
        <p className="text-4xl">🏆</p>
        <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">{message}</h3>
        <p className="mt-1 text-sm text-ink-500">
          You scored {score} out of {total} points ({percent}%).
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={playAgain}
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
    );
  }

  if (!current) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3">
        <div className="flex gap-5 text-sm">
          <span>
            <span className="font-semibold text-ink-900">{score}</span>{" "}
            <span className="text-ink-500">points</span>
          </span>
          <span className="text-ink-500">
            Question {index + 1} of {order.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onChangeTopic}
          className="rounded-full border border-ink-100 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-300"
        >
          Change Topic
        </button>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${(index / order.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-ink-500">What is this?</p>
        <span className="mt-3 block text-7xl">{current.emoji}</span>

        <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selected === option.word;
            const isCorrectOption = option.word === current.word;
            const showState = answered && (isSelected || isCorrectOption);
            return (
              <button
                key={option.word}
                type="button"
                onClick={() => selectOption(option)}
                disabled={answered}
                className={clsx(
                  "rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-colors",
                  showState && isCorrectOption
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : showState && isSelected
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-ink-100 bg-white text-ink-900 hover:border-brand-300",
                  answered && !showState && "opacity-50"
                )}
              >
                {option.word}
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            type="button"
            onClick={next}
            className="mt-8 rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
