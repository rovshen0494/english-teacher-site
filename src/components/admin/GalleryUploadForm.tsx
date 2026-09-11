"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function readVideoDimensionsAndPoster(file: File): Promise<{ width: number; height: number; poster: Blob | null }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ width: video.videoWidth, height: video.videoHeight, poster: null });
        URL.revokeObjectURL(url);
        return;
      }
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        resolve({ width: video.videoWidth, height: video.videoHeight, poster: blob });
        URL.revokeObjectURL(url);
      }, "image/jpeg", 0.85);
    };

    video.onerror = reject;
  });
}

export default function GalleryUploadForm({ nextSortOrder }: { nextSortOrder: number }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const isVideo = file.type.startsWith("video/");
      const baseName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const storagePath = `${isVideo ? "videos" : "images"}/classroom/${baseName}`;

      const { error: uploadError } = await supabase.storage.from("gallery").upload(storagePath, file, {
        contentType: file.type,
      });
      if (uploadError) throw uploadError;

      const { data: srcUrlData } = supabase.storage.from("gallery").getPublicUrl(storagePath);

      let width: number;
      let height: number;
      let posterUrl: string | null = null;

      if (isVideo) {
        const dims = await readVideoDimensionsAndPoster(file);
        width = dims.width;
        height = dims.height;
        if (dims.poster) {
          const posterPath = `images/classroom/${baseName}-poster.jpg`;
          const { error: posterError } = await supabase.storage
            .from("gallery")
            .upload(posterPath, dims.poster, { contentType: "image/jpeg" });
          if (!posterError) {
            const { data: posterUrlData } = supabase.storage.from("gallery").getPublicUrl(posterPath);
            posterUrl = posterUrlData.publicUrl;
          }
        }
      } else {
        const dims = await readImageDimensions(file);
        width = dims.width;
        height = dims.height;
      }

      const { error: insertError } = await supabase.from("gallery_items").insert({
        type: isVideo ? "video" : "photo",
        src: srcUrlData.publicUrl,
        poster: posterUrl,
        width,
        height,
        alt: alt.trim() || file.name,
        sort_order: nextSortOrder,
      });
      if (insertError) throw insertError;

      setFile(null);
      setAlt("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Photo or video file
        <input
          type="file"
          required
          accept="image/*,video/mp4"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-ink-900"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Alt text / caption
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe what's happening"
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>
      <button
        type="submit"
        disabled={!file || uploading}
        className="self-end rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
    </form>
  );
}
