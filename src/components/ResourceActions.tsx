"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "favourite-resources";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function readFavourites(): string[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
}

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-100 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 hover:border-brand-300"
    >
      Print Activity
    </button>
  );
}

export function FavouriteButton({ slug }: { slug: string }) {
  const isFavourite = useSyncExternalStore(
    subscribe,
    () => readFavourites().includes(slug),
    () => false
  );

  const toggle = () => {
    const stored = readFavourites();
    const next = stored.includes(slug) ? stored.filter((s) => s !== slug) : [...stored, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitChange();
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-100 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 hover:border-brand-300"
    >
      <span aria-hidden>{isFavourite ? "★" : "☆"}</span>
      {isFavourite ? "Saved to Favourites" : "Add to Favourites"}
    </button>
  );
}
