"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  mapSessionRow,
  buildQuestionOptions,
  QUESTION_TIME_LIMIT_SECONDS,
  ANSWER_STYLES,
  type GameSession,
  type GameSessionRow,
} from "@/lib/liveQuiz";
import { useCountdown } from "@/lib/useCountdown";
import AnswerShape from "@/components/live-quiz/AnswerShape";

interface AnswerResult {
  correct: boolean;
  points: number;
}

export default function PlayView({ roomCode }: { roomCode: string }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<GameSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [nickname, setNickname] = useState("");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const storageKey = `live-quiz-player-${roomCode}`;

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("room_code", roomCode)
        .maybeSingle();
      if (!active) return;
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const mapped = mapSessionRow(data as GameSessionRow);
      setSession(mapped);
      setLoading(false);

      const storedPlayerId = sessionStorage.getItem(storageKey);
      if (storedPlayerId) setPlayerId(storedPlayerId);

      const channel = supabase
        .channel(`play-${mapped.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "game_sessions", filter: `id=eq.${mapped.id}` },
          (payload) => {
            if (payload.eventType === "DELETE") return;
            const updated = mapSessionRow(payload.new as GameSessionRow);
            setSession((prev) => {
              if (prev && prev.currentQuestionIndex !== updated.currentQuestionIndex) {
                setAnsweredIndex(null);
                setResult(null);
              }
              return updated;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    load();
    return () => {
      active = false;
    };
  }, [roomCode, storageKey]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed || !session) return;

    setJoining(true);
    setJoinError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("game_players")
      .insert({ session_id: session.id, nickname: trimmed })
      .select("id")
      .single();

    setJoining(false);
    if (error || !data) {
      setJoinError("Couldn't join the game. Please try again.");
      return;
    }
    sessionStorage.setItem(storageKey, data.id);
    setPlayerId(data.id);
  }

  async function handleAnswer(index: number, word: string) {
    if (!session || !playerId || answeredIndex !== null) return;
    setAnsweredIndex(index);

    const currentWord = session.questionOrder[session.currentQuestionIndex];
    const isCorrect = word === currentWord;

    const supabase = createClient();
    const { data, error } = await supabase.rpc("submit_answer", {
      p_session_id: session.id,
      p_player_id: playerId,
      p_question_index: session.currentQuestionIndex,
      p_is_correct: isCorrect,
    });

    if (!error && data && data[0]) {
      setResult({ correct: isCorrect, points: data[0].points_awarded });
    }
  }

  useEffect(() => {
    if (session?.status !== "finished" || !playerId) return;
    const supabase = createClient();
    supabase
      .from("game_players")
      .select("score")
      .eq("id", playerId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setFinalScore(data.score);
      });
  }, [session?.status, playerId]);

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

  if (loading) {
    return <p className="p-8 text-center text-sm text-ink-500">Loading...</p>;
  }

  if (notFound || !session) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-3xl">🤔</p>
        <p className="font-semibold text-ink-900">Game not found</p>
        <p className="text-sm text-ink-500">Check the room code and try again.</p>
        <Link href="/play" className="mt-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
          &larr; Try another code
        </Link>
      </div>
    );
  }

  if (!playerId) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form onSubmit={handleJoin} className="w-full max-w-sm rounded-3xl border border-ink-100 bg-white p-8 text-center">
          <p className="text-3xl">🙋</p>
          <h1 className="mt-2 font-display text-xl font-semibold text-ink-900">Room {session.roomCode}</h1>
          <p className="mt-1 text-sm text-ink-500">Enter a nickname to join</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            autoFocus
            className="mt-6 w-full rounded-xl border border-ink-100 px-4 py-3 text-center text-lg text-ink-900 focus:border-brand-400 focus:outline-none"
          />
          {joinError && <p className="mt-2 text-sm text-red-600">{joinError}</p>}
          <button
            type="submit"
            disabled={!nickname.trim() || joining}
            className="mt-4 w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-40"
          >
            {joining ? "Joining..." : "Join Game"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-8 text-center">
      {session.status === "lobby" && (
        <>
          <p className="text-4xl">✅</p>
          <p className="mt-3 font-display text-xl font-semibold text-ink-900">You&apos;re in!</p>
          <p className="mt-1 text-sm text-ink-500">Waiting for the host to start the game...</p>
        </>
      )}

      {session.status === "question" && answeredIndex === null && (
        <div className="w-full max-w-md">
          <p className="font-display text-3xl font-bold text-brand-700">{remaining}s</p>
          <p className="mt-1 text-sm text-ink-500">Look at the shared screen, then choose your answer</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {options.map((option, i) => (
              <button
                key={option.word}
                type="button"
                onClick={() => handleAnswer(i, option.word)}
                style={{ backgroundColor: ANSWER_STYLES[i].bg }}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl p-4 text-white active:opacity-80"
              >
                <AnswerShape shape={ANSWER_STYLES[i].shape} className="h-10 w-10" />
                <span className="font-semibold capitalize">{option.word}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {session.status === "question" && answeredIndex !== null && (
        <>
          <p className="text-4xl">🔒</p>
          <p className="mt-3 font-display text-xl font-semibold text-ink-900">Answer locked in!</p>
          <p className="mt-1 text-sm text-ink-500">Waiting for other players...</p>
        </>
      )}

      {session.status === "reveal" && (
        <>
          <p className="text-4xl">{result?.correct ? "🎉" : "😬"}</p>
          <p className="mt-3 font-display text-2xl font-semibold text-ink-900">
            {result ? (result.correct ? "Correct!" : "Not quite") : "Time's up"}
          </p>
          {result && (
            <p className="mt-1 text-sm text-ink-500">
              {result.correct ? `+${result.points} points` : "0 points this round"}
            </p>
          )}
        </>
      )}

      {session.status === "leaderboard" && (
        <>
          <p className="text-4xl">📊</p>
          <p className="mt-3 font-display text-xl font-semibold text-ink-900">Check the big screen!</p>
          <p className="mt-1 text-sm text-ink-500">The leaderboard is showing there.</p>
        </>
      )}

      {session.status === "finished" && (
        <>
          <p className="text-4xl">🏁</p>
          <p className="mt-3 font-display text-2xl font-semibold text-ink-900">Game over!</p>
          {finalScore !== null && (
            <p className="mt-1 text-sm text-ink-500">Your final score: <span className="font-semibold text-brand-700">{finalScore}</span></p>
          )}
          <Link href="/games" className="mt-6 text-sm font-semibold text-brand-700 hover:text-brand-800">
            &larr; Back to Games
          </Link>
        </>
      )}
    </div>
  );
}
