"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/types";

function GalleryTile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const [playing, setPlaying] = useState(false);

  if (item.type === "photo") {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="block w-full cursor-zoom-in transition-opacity hover:opacity-90"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="h-auto w-full rounded-2xl"
        />
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-900">
      <video
        controls
        playsInline
        preload="metadata"
        poster={item.poster}
        aria-label={item.alt}
        width={item.width}
        height={item.height}
        className="block h-auto w-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={item.src} type="video/mp4" />
      </video>
      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-4 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="90vw"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain"
      />
    </div>
  );
}

export default function ClassroomGallery({ items }: { items: GalleryItem[] }) {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          <GalleryTile item={item} onOpen={() => setLightboxItem(item)} />
        </div>
      ))}
      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </div>
  );
}
