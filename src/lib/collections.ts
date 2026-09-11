import { createClient } from "./supabase/server";
import type { CollectionMeta } from "./types";

interface CollectionRow {
  slug: string;
  title: string;
  description: string;
}

function mapRow(row: CollectionRow): CollectionMeta {
  return { slug: row.slug, title: row.title, description: row.description };
}

export async function getCollections(): Promise<CollectionMeta[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("collections").select("*").order("title", { ascending: true });
  if (error) throw error;
  return (data as CollectionRow[]).map(mapRow);
}

export async function getCollectionBySlug(slug: string): Promise<CollectionMeta | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("collections").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as CollectionRow) : undefined;
}
