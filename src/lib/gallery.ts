import { createClient } from "./supabase/server";
import type { GalleryItem } from "./types";

interface GalleryItemRow {
  id: string;
  type: string;
  src: string;
  poster: string | null;
  width: number;
  height: number;
  alt: string;
  sort_order: number;
}

function mapRow(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    type: row.type as GalleryItem["type"],
    src: row.src,
    poster: row.poster ?? undefined,
    width: row.width,
    height: row.height,
    alt: row.alt,
    sortOrder: row.sort_order,
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as GalleryItemRow[]).map(mapRow);
}
