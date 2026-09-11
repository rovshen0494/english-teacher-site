import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ResourceLibrary from "@/components/ResourceLibrary";
import { getAllResources } from "@/lib/resources";
import { getCollections } from "@/lib/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "English Teaching Resources",
  description:
    "Browse a searchable library of English teaching resources — games, lesson plans, worksheets, flashcards and IELTS/TOEFL materials for young learners, teenagers, adults and exam candidates.",
};

export default async function ResourcesPage() {
  const [resources, collections] = await Promise.all([getAllResources(), getCollections()]);

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Teaching Resource Library"
        title="English Teaching Resources"
        description="Games, activities and lesson ideas designed to make English lessons more engaging."
      />

      <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🎮</span>
          <div>
            <p className="font-display font-semibold text-ink-900">Looking for something to play, not just print?</p>
            <p className="text-sm text-ink-500">Try the interactive games — playable in the browser, no downloads needed.</p>
          </div>
        </div>
        <Link
          href="/games"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Play Interactive Games
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/resources/create"
          className="rounded-full border border-dashed border-brand-300 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700"
        >
          AI Resource Generator — Coming Soon
        </Link>
      </div>

      <div className="mt-10">
        <Suspense fallback={null}>
          <ResourceLibrary resources={resources} />
        </Suspense>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Browse by Purpose" title="Collections" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/resources/collections/${collection.slug}`}
              className="rounded-2xl border border-ink-100 bg-white p-5 transition-colors hover:border-brand-300"
            >
              <h3 className="font-display font-semibold text-ink-900">{collection.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{collection.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
