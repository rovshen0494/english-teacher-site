"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CollectionMeta } from "@/lib/types";

export default function CollectionForm({ collection }: { collection?: CollectionMeta }) {
  const router = useRouter();
  const isEdit = Boolean(collection);
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [title, setTitle] = useState(collection?.title ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const row = { slug: slug.trim(), title: title.trim(), description: description.trim() };

    const { error } = isEdit
      ? await supabase.from("collections").update(row).eq("slug", collection!.slug)
      : await supabase.from("collections").insert(row);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/collections");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Slug
        <input
          required
          disabled={isEdit}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900 disabled:bg-ink-100/50"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Description
        <textarea
          required
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Collection"}
        </button>
      </div>
    </form>
  );
}
