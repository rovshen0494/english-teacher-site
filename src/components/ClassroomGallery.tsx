"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryItem } from "@/content/gallery/classroom-media";

function GalleryTile({ item }: { item: GalleryItem }) {
  const [playing, setPlaying] = useState(false);

  if (item.type === "photo") {
    return (
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="h-auto w-full rounded-2xl"
      />
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

export default function ClassroomGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
      {items.map((item) => (
        <div key={item.src} className="break-inside-avoid">
          <GalleryTile item={item} />
        </div>
      ))}
    </div>
  );
}
