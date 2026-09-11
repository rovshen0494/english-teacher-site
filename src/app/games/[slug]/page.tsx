import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import GamePlayer from "@/components/games/GamePlayer";
import { GAMES, getGameMeta } from "@/lib/games";
import { WORD_SETS } from "@/content/games/word-sets";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameMeta(slug);
  if (!game) return {};
  return {
    title: game.title,
    description: `${game.description} Play free in your browser — no downloads or sign-up needed.`,
  };
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { slug } = await params;
  const { topic } = await searchParams;
  const game = getGameMeta(slug);
  if (!game) notFound();

  return (
    <Container className="py-16 sm:py-20">
      <Link href="/games" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
        &larr; All Games
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-4xl">{game.emoji}</span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{game.title}</h1>
          <p className="text-sm text-ink-500">{game.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <GamePlayer gameType={game.slug} wordSets={WORD_SETS} initialTopic={topic} />
      </div>
    </Container>
  );
}
