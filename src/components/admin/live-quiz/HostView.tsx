"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/client";
import {
  mapSessionRow,
  mapPlayerRow,
  getQuestionWord,
  buildQuestionOptions,
  QUESTION_TIME_LIMIT_SECONDS,
  ANSWER_STYLES,
  type GameSession,
  type GamePlayer,
  type GameSessionRow,
  type GamePlayerRow,
} from "@/lib/liveQuiz";
import { useCountdown } from "@/lib/useCountdown";
import AnswerShape from "@/components/live-quiz/AnswerShape";
import { SITE } from "@/lib/constants";

export default function HostView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const { data: sessionData } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      if (!active) return;
      if (!sessionData) {
        setNotFound(true);
        return;
      }
      setSession(mapSessionRow(sessionData as GameSessionRow));

      const { data: playersData } = await supabase
        .from("game_players")
        .select("*")
        .eq("session_id", sessionId)
        .order("score", { ascending: false });
      if (active && playersData) {
        setPlayers((playersData as GamePlayerRow[]).map(mapPlayerRow));
      }
    }

    load();

    const channel = supabase
      .channel(`host-${sessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          if (payload.eventType === "DELETE") return;
          setSession(mapSessionRow(payload.new as GameSessionRow));
          setAnsweredCount(0);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_players", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          if (payload.eventType === "DELETE") return;
          const updated = mapPlayerRow(payload.new as GamePlayerRow);
          setPlayers((prev) => {
            const exists = prev.some((p) => p.id === updated.id);
            const next = exists ? prev.map((p) => (p.id === updated.id ? updated : p)) : [...prev, updated];
            return [...next].sort((a, b) => b.score - a.score);
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "game_answers", filter: `session_id=eq.${sessionId}` },
        () => setAnsweredCount((c) => c + 1)
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const roomCode = session?.roomCode;
  useEffect(() => {
    if (!roomCode) return;
    const joinUrl = `${SITE.url}/play/${roomCode}`;
    QRCode.toDataURL(joinUrl, { width: 320, margin: 1 }).then(setQrDataUrl);
  }, [roomCode]);

  const remaining = useCountdown(
    session?.status === "question" ? session.questionStartedAt : null,
    QUESTION_TIME_LIMIT_SECONDS
  );

  const currentWord = session ? session.questionOrder[session.currentQuestionIndex] : undefined;
  const topic = session?.topic;
  const options = useMemo(
    () => (topic && currentWord ? buildQuestionOptions(topic, currentWord) : []),
    [topic, currentWord]
  );

  if (notFound) {
    return (
      <div>
        <p className="text-sm text-red-600">Game session not found.</p>
        <Link href="/admin/live-quiz" className="mt-4 inline-block text-sm font-semibold text-brand-700">
          &larr; Back to Live Quiz
        </Link>
      </div>
    );
  }

  if (!session) {
    return <p className="text-sm text-ink-500">Loading...</p>;
  }

  const supabase = createClient();

  async function updateSession(patch: Partial<GameSessionRow>) {
    await supabase.from("game_sessions").update(patch).eq("id", sessionId);
  }

  async function startGame() {
    await updateSession({
      status: "question",
      current_question_index: 0,
      question_started_at: new Date().toISOString(),
    });
  }

  async function showReveal() {
    await updateSession({ status: "reveal" });
  }

  async function showLeaderboard() {
    await updateSession({ status: "leaderboard" });
  }

  async function nextQuestion() {
    if (!session) return;
    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= session.questionOrder.length) {
      await updateSession({ status: "finished" });
    } else {
      await updateSession({
        status: "question",
        current_question_index: nextIndex,
        question_started_at: new Date().toISOString(),
      });
    }
  }

  const isLastQuestion = session.currentQuestionIndex >= session.questionOrder.length - 1;
  const questionData = currentWord ? getQuestionWord(session.topic, currentWord) : undefined;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/live-quiz" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          &larr; End &amp; back to Live Quiz
        </Link>
        <span className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
          Room Code: {session.roomCode}
        </span>
      </div>

      {session.status === "lobby" && (
        <div className="mt-8 grid gap-8 rounded-3xl border border-ink-100 bg-white p-8 sm:grid-cols-2 sm:items-center">
          <div className="text-center">
            {qrDataUrl && (
              <Image
                src={qrDataUrl}
                alt="QR code to join"
                width={320}
                height={320}
                unoptimized
                className="mx-auto rounded-xl"
              />
            )}
            <p className="mt-4 font-display text-4xl font-bold tracking-widest text-ink-900">{session.roomCode}</p>
            <p className="mt-1 text-sm text-ink-500">Scan the QR code or go to {SITE.url}/play and enter the code</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900">
              Players ({players.length})
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {players.map((p) => (
                <span key={p.id} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                  {p.nickname}
                </span>
              ))}
              {players.length === 0 && <p className="text-sm text-ink-300">Waiting for players to join...</p>}
            </div>
            <button
              type="button"
              onClick={startGame}
              disabled={players.length === 0}
              className="mt-6 w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-40"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {session.status === "question" && questionData && (
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>
              Question {session.currentQuestionIndex + 1} of {session.questionOrder.length}
            </span>
            <span>{answeredCount} of {players.length} answered</span>
            <span className="font-display text-2xl font-bold text-brand-700">{remaining}s</span>
          </div>

          <div className="mt-4 rounded-3xl border border-ink-100 bg-white p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-500">What is this?</p>
            <span className="mt-3 block text-8xl">{questionData.emoji}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {options.map((option, i) => (
              <div
                key={option.word}
                style={{ backgroundColor: ANSWER_STYLES[i].bg }}
                className="flex items-center gap-3 rounded-2xl px-5 py-4 text-white"
              >
                <AnswerShape shape={ANSWER_STYLES[i].shape} className="h-6 w-6 shrink-0" />
                <span className="font-semibold capitalize">{option.word}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={showReveal}
            className="mt-6 w-full rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Show Answer
          </button>
        </div>
      )}

      {session.status === "reveal" && questionData && (
        <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-10 text-center">
          <span className="text-6xl">{questionData.emoji}</span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink-500">The answer is</p>
          <p className="mt-1 font-display text-3xl font-bold capitalize text-brand-700">{currentWord}</p>
          <button
            type="button"
            onClick={showLeaderboard}
            className="mt-8 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Show Leaderboard
          </button>
        </div>
      )}

      {session.status === "leaderboard" && (
        <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-8">
          <h2 className="text-center font-display text-2xl font-semibold text-ink-900">Leaderboard</h2>
          <ol className="mt-6 space-y-2">
            {players.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3"
              >
                <span className="font-semibold text-ink-900">
                  {i + 1}. {p.nickname}
                </span>
                <span className="font-display font-bold text-brand-700">{p.score}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={nextQuestion}
            className="mt-6 w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
          >
            {isLastQuestion ? "Finish Game" : "Next Question"}
          </button>
        </div>
      )}

      {session.status === "finished" && (
        <div className="mt-8 rounded-3xl border border-brand-200 bg-brand-50 p-10 text-center">
          <p className="text-4xl">🏆</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900">Final Results</h2>
          <ol className="mx-auto mt-6 max-w-md space-y-2 text-left">
            {players.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
              >
                <span className="font-semibold text-ink-900">
                  {i + 1}. {p.nickname}
                </span>
                <span className="font-display font-bold text-brand-700">{p.score}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/admin/live-quiz"
            className="mt-8 inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
          >
            New Game
          </Link>
        </div>
      )}
    </div>
  );
}
