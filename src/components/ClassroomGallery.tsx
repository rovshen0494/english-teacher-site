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

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 ${
        direction === "prev" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {direction === "prev" ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const item = photos[index];
  const canNavigate = photos.length > 1;

  function goPrev() {
    onNavigate((index - 1 + photos.length) % photos.length);
  }
  function goNext() {
    onNavigate((index + 1) % photos.length);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canNavigate) goPrev();
      if (e.key === "ArrowRight" && canNavigate) goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, canNavigate]);

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
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {canNavigate && (
        <>
          <NavButton direction="prev" onClick={goPrev} />
          <NavButton direction="next" onClick={goNext} />
        </>
      )}

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
  const photos = items.filter((item) => item.type === "photo");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          <GalleryTile
            item={item}
            onOpen={() => setLightboxIndex(photos.findIndex((p) => p.id === item.id))}
          />
        </div>
      ))}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
