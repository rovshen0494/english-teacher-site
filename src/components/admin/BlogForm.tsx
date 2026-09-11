"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BLOG_CATEGORIES } from "@/lib/constants";
import type { BlogPost } from "@/lib/types";

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  relatedResources: string;
  featured: boolean;
  body: string;
}

function toFormState(post?: BlogPost): FormState {
  const today = new Date().toISOString().slice(0, 10);
  if (!post) {
    return {
      slug: "",
      title: "",
      excerpt: "",
      category: BLOG_CATEGORIES[0],
      date: today,
      author: "",
      relatedResources: "",
      featured: false,
      body: "",
    };
  }
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    author: post.author,
    relatedResources: (post.relatedResources ?? []).join(", "),
    featured: post.featured ?? false,
    body: post.body,
  };
}

export default function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [form, setForm] = useState<FormState>(() => toFormState(post));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const row = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category,
      date: form.date,
      author: form.author.trim(),
      related_resources: form.relatedResources.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      body: form.body,
    };

    const { error } = isEdit
      ? await supabase.from("blog_posts").update(row).eq("slug", post!.slug)
      : await supabase.from("blog_posts").insert(row);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Title
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Slug
          <input
            required
            disabled={isEdit}
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900 disabled:bg-ink-100/50"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Excerpt
        <textarea
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Category
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Date
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Author
          <input
            required
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Related Resources <span className="font-normal normal-case text-ink-300">(slugs, comma-separated)</span>
        <input
          value={form.relatedResources}
          onChange={(e) => update("relatedResources", e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Body (Markdown)
        <textarea
          required
          rows={16}
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 font-mono text-sm font-normal text-ink-900"
        />
      </label>

      <label className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="h-4 w-4"
        />
        Featured
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
