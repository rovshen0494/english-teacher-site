"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/play/${trimmed}`);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-3xl">🎮</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-ink-900">Join a Live Quiz</h1>
        <p className="mt-1 text-sm text-ink-500">Enter the room code from the screen</p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ROOM CODE"
          maxLength={6}
          autoFocus
          className="mt-6 w-full rounded-xl border border-ink-100 px-4 py-3 text-center font-display text-2xl font-bold uppercase tracking-widest text-ink-900 focus:border-brand-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!code.trim()}
          className="mt-4 w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-40"
        >
          Join
        </button>
      </form>
    </div>
  );
}
