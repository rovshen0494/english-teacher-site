"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WORD_SETS } from "@/content/games/word-sets";
import { buildQuestionOrder, generateRoomCode } from "@/lib/liveQuiz";

export default function AdminLiveQuizPage() {
  const router = useRouter();
  const [creating, setCreating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createGame(topicSlug: string) {
    setCreating(topicSlug);
    setError(null);

    const supabase = createClient();
    const questionOrder = buildQuestionOrder(topicSlug);

    // Room codes are short enough that a collision is possible (unlikely) —
    // retry a few times against the unique constraint rather than failing outright.
    for (let attempt = 0; attempt < 5; attempt++) {
      const roomCode = generateRoomCode();
      const { data, error: insertError } = await supabase
        .from("game_sessions")
        .insert({ room_code: roomCode, topic: topicSlug, question_order: questionOrder })
        .select("id")
        .single();

      if (!insertError && data) {
        router.push(`/admin/live-quiz/${data.id}/host`);
        return;
      }

      if (insertError && insertError.code !== "23505") {
        setError(insertError.message);
        setCreating(null);
        return;
      }
    }

    setError("Couldn't generate a unique room code — please try again.");
    setCreating(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Live Quiz</h1>
      <p className="mt-1 text-sm text-ink-500">
        Start a Kahoot-style live round — students join with a room code or QR code on their phones,
        and answer along with a shared screen.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WORD_SETS.map((set) => (
          <button
            key={set.slug}
            type="button"
            onClick={() => createGame(set.slug)}
            disabled={creating !== null}
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink-100 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 disabled:opacity-50"
          >
            <span className="text-4xl">{set.emoji}</span>
            <span className="font-display font-semibold text-ink-900">{set.title}</span>
            <span className="text-xs text-ink-300">
              {set.level} &middot; {set.words.length} questions
            </span>
            {creating === set.slug && <span className="text-xs font-semibold text-brand-700">Creating...</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
