import type { WordSet } from "@/content/games/word-sets";

export default function TopicPicker({
  wordSets,
  onSelect,
}: {
  wordSets: WordSet[];
  onSelect: (set: WordSet) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-700">Choose a topic to play</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wordSets.map((set) => (
          <button
            key={set.slug}
            type="button"
            onClick={() => onSelect(set)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink-100 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
          >
            <span className="text-4xl">{set.emoji}</span>
            <span className="font-display font-semibold text-ink-900">{set.title}</span>
            <span className="text-xs text-ink-300">
              {set.level} &middot; {set.words.length} words
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
