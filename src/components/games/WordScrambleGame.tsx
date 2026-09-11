"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { GameWord, WordSet } from "@/content/games/word-sets";
import { shuffle } from "@/lib/shuffle";

function scrambleWord(word: string): string[] {
  const letters = word.toLowerCase().split("");
  let attempt = shuffle(letters);
  // Avoid the rare case where the shuffle happens to land on the original order.
  if (letters.length > 2) {
    let tries = 0;
    while (attempt.join("") === letters.join("") && tries < 5) {
      attempt = shuffle(letters);
      tries++;
    }
  }
  return attempt;
}

function buildRound(wordSet: WordSet): GameWord[] {
  const eligible = wordSet.words.filter((w) => !w.word.includes(" "));
  return shuffle(eligible);
}

export default function WordScrambleGame({
  wordSet,
  onChangeTopic,
}: {
  wordSet: WordSet;
  onChangeTopic: () => void;
}) {
  const [round, setRound] = useState<GameWord[]>(() => buildRound(wordSet));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  const finished = index >= round.length;
  const current = !finished ? round[index] : null;
  const letters = useMemo(() => (current ? scrambleWord(current.word) : []), [current]);

  const builtAnswer = usedIndices.map((i) => letters[i]);
  const isComplete = current ? builtAnswer.length === current.word.length : false;
  const isCorrect = isComplete && current ? builtAnswer.join("") === current.word.toLowerCase() : false;

  useEffect(() => {
    if (!isCorrect) return;
    const timer = setTimeout(() => {
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      setUsedIndices([]);
      setShowHint(false);
      setIndex((i) => i + 1);
    }, 1100);
    return () => clearTimeout(timer);
  }, [isCorrect]);

  function selectLetter(letterIndex: number) {
    if (usedIndices.includes(letterIndex) || isComplete) return;
    setUsedIndices((prev) => [...prev, letterIndex]);
  }

  function undoLetter(position: number) {
    setUsedIndices((prev) => prev.filter((_, i) => i !== position));
  }

  function clearAnswer() {
    setUsedIndices([]);
  }

  function skip() {
    setStreak(0);
    setUsedIndices([]);
    setShowHint(false);
    setIndex((i) => i + 1);
  }

  function playAgain() {
    setRound(buildRound(wordSet));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setUsedIndices([]);
    setShowHint(false);
  }

  if (finished) {
    const total = round.length * 10;
    return (
      <div>
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-10 text-center">
          <p className="text-4xl">✅</p>
          <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">Round complete!</h3>
          <p className="mt-1 text-sm text-ink-500">
            You scored {score} out of {total} points across {round.length} words.
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
          <span>
            <span className="font-semibold text-ink-900">{streak}</span>{" "}
            <span className="text-ink-500">streak</span>
          </span>
          <span className="text-ink-500">
            Word {index + 1} of {round.length}
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

      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <span className="text-6xl">{current.emoji}</span>

        <div className="mx-auto mt-6 flex min-h-14 max-w-md flex-wrap justify-center gap-2">
          {usedIndices.length === 0 && (
            <span className="text-sm text-ink-300">Tap the letters below to spell the word</span>
          )}
          {usedIndices.map((letterIndex, position) => (
            <button
              key={position}
              type="button"
              onClick={() => undoLetter(position)}
              className={clsx(
                "flex h-11 w-11 items-center justify-center rounded-lg border text-lg font-semibold uppercase",
                isComplete && isCorrect
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : isComplete && !isCorrect
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-brand-300 bg-brand-50 text-brand-700"
              )}
            >
              {letters[letterIndex]}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
          {letters.map((letter, letterIndex) => (
            <button
              key={letterIndex}
              type="button"
              disabled={usedIndices.includes(letterIndex)}
              onClick={() => selectLetter(letterIndex)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-100 bg-white text-lg font-semibold uppercase text-ink-900 transition-opacity hover:border-brand-300 disabled:opacity-0"
            >
              {letter}
            </button>
          ))}
        </div>

        {isComplete && !isCorrect && (
          <p className="mt-4 text-sm font-medium text-red-600">Not quite — try again!</p>
        )}
        {isComplete && isCorrect && (
          <p className="mt-4 text-sm font-medium text-brand-700">Correct! Next word coming up...</p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={clearAnswer}
            disabled={usedIndices.length === 0}
            className="rounded-full border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-brand-300 disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setShowHint(true)}
            disabled={showHint}
            className="rounded-full border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-brand-300 disabled:opacity-40"
          >
            Show Hint
          </button>
          <button
            type="button"
            onClick={skip}
            className="rounded-full border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-brand-300"
          >
            Skip
          </button>
        </div>

        {showHint && <p className="mt-4 text-sm italic text-ink-500">{current.hint}</p>}
      </div>
    </div>
  );
}
