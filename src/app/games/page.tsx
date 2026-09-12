import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Tag from "@/components/Tag";
import { GAMES } from "@/lib/games";
import { WORD_SETS } from "@/content/games/word-sets";

export const metadata: Metadata = {
  title: "Interactive English Games",
  description:
    "Play free interactive English games in your browser — vocabulary matching, word scramble and quizzes. No downloads or sign-up needed, great for kids, teens and adult learners.",
};

export default function GamesHubPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Play & Learn"
        title="Interactive English Games"
        description="Real, playable games you can jump into right now — no downloads, no sign-up. Pick a game, choose a topic, and start practising."
      />

      <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl">📱</span>
          <div>
            <p className="font-display font-semibold text-ink-900">In class right now?</p>
            <p className="text-sm text-ink-500">If your teacher started a live quiz, join it here with the room code.</p>
          </div>
        </div>
        <Link
          href="/play"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Join a Live Quiz
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/games/${game.slug}`}
            className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
          >
            <span className="text-4xl">{game.emoji}</span>
            <h2 className="mt-4 font-display text-lg font-semibold text-ink-900 group-hover:text-brand-700">
              {game.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{game.description}</p>
            <Tag tone="brand" className="mt-4 self-start">
              {game.skill}
            </Tag>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
              Play Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-lg font-semibold text-ink-900">Topics available</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {WORD_SETS.map((set) => (
            <span
              key={set.slug}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 px-3 py-1.5 text-sm text-ink-700"
            >
              <span>{set.emoji}</span>
              {set.title}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-500">
          Every game works with every topic above — mix and match to keep practice varied.
        </p>
      </div>
    </Container>
  );
}
