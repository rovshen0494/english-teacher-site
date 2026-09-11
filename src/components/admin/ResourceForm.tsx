"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AGE_GROUPS,
  DIFFICULTIES,
  ENGLISH_LEVELS,
  RESOURCE_TYPES,
  SKILLS,
  TOPICS,
} from "@/lib/constants";
import type { Resource, ResourceDownload } from "@/lib/types";

interface FormState {
  slug: string;
  title: string;
  description: string;
  resourceType: string;
  ageGroups: string[];
  englishLevels: string[];
  primarySkill: string;
  secondarySkills: string[];
  topics: string[];
  duration: string;
  classSize: string;
  prepTime: string;
  difficulty: string;
  materials: string;
  relatedResources: string;
  collections: string;
  downloads: ResourceDownload[];
  author: string;
  dateCreated: string;
  lastUpdated: string;
  featured: boolean;
  body: string;
}

function toFormState(resource?: Resource): FormState {
  const today = new Date().toISOString().slice(0, 10);
  if (!resource) {
    return {
      slug: "",
      title: "",
      description: "",
      resourceType: RESOURCE_TYPES[0],
      ageGroups: [],
      englishLevels: [],
      primarySkill: SKILLS[0],
      secondarySkills: [],
      topics: [],
      duration: "",
      classSize: "",
      prepTime: "",
      difficulty: DIFFICULTIES[0],
      materials: "",
      relatedResources: "",
      collections: "",
      downloads: [],
      author: "",
      dateCreated: today,
      lastUpdated: today,
      featured: false,
      body: "",
    };
  }
  return {
    slug: resource.slug,
    title: resource.title,
    description: resource.description,
    resourceType: resource.resourceType,
    ageGroups: resource.ageGroups,
    englishLevels: resource.englishLevels,
    primarySkill: resource.primarySkill,
    secondarySkills: resource.secondarySkills,
    topics: resource.topics,
    duration: resource.duration,
    classSize: resource.classSize,
    prepTime: resource.prepTime,
    difficulty: resource.difficulty,
    materials: (resource.materials ?? []).join(", "),
    relatedResources: (resource.relatedResources ?? []).join(", "),
    collections: (resource.collections ?? []).join(", "),
    downloads: resource.downloads ?? [],
    author: resource.author,
    dateCreated: resource.dateCreated,
    lastUpdated: resource.lastUpdated,
    featured: resource.featured ?? false,
    body: resource.body,
  };
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(option: string) {
    onChange(selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option]);
  }
  return (
    <div>
      <p className="text-xs font-semibold text-ink-700">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected.includes(option)
                ? "border-brand-400 bg-brand-50 text-brand-700"
                : "border-ink-100 text-ink-700 hover:border-brand-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ResourceForm({ resource }: { resource?: Resource }) {
  const router = useRouter();
  const isEdit = Boolean(resource);
  const [form, setForm] = useState<FormState>(() => toFormState(resource));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addDownload() {
    update("downloads", [...form.downloads, { label: "", fileType: "PDF", url: "" }]);
  }

  function updateDownload(index: number, patch: Partial<ResourceDownload>) {
    update(
      "downloads",
      form.downloads.map((d, i) => (i === index ? { ...d, ...patch } : d))
    );
  }

  function removeDownload(index: number) {
    update("downloads", form.downloads.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const row = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      resource_type: form.resourceType,
      age_groups: form.ageGroups,
      english_levels: form.englishLevels,
      primary_skill: form.primarySkill,
      secondary_skills: form.secondarySkills,
      topics: form.topics,
      duration: form.duration.trim(),
      class_size: form.classSize.trim(),
      prep_time: form.prepTime.trim(),
      difficulty: form.difficulty,
      materials: form.materials.split(",").map((m) => m.trim()).filter(Boolean),
      related_resources: form.relatedResources.split(",").map((s) => s.trim()).filter(Boolean),
      collections: form.collections.split(",").map((s) => s.trim()).filter(Boolean),
      downloads: form.downloads.filter((d) => d.label && d.url),
      author: form.author.trim(),
      date_created: form.dateCreated,
      last_updated: new Date().toISOString().slice(0, 10),
      featured: form.featured,
      body: form.body,
    };

    const { error } = isEdit
      ? await supabase.from("resources").update(row).eq("slug", resource!.slug)
      : await supabase.from("resources").insert(row);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/resources");
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
          Slug (URL, e.g. word-bingo)
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
        Description
        <textarea
          required
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Resource Type
          <select
            value={form.resourceType}
            onChange={(e) => update("resourceType", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Primary Skill
          <select
            value={form.primarySkill}
            onChange={(e) => update("primarySkill", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          >
            {SKILLS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Difficulty
          <select
            value={form.difficulty}
            onChange={(e) => update("difficulty", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>

      <CheckboxGroup label="Age Groups" options={AGE_GROUPS} selected={form.ageGroups} onChange={(v) => update("ageGroups", v)} />
      <CheckboxGroup label="English Levels" options={ENGLISH_LEVELS} selected={form.englishLevels} onChange={(v) => update("englishLevels", v)} />
      <CheckboxGroup label="Secondary Skills" options={SKILLS} selected={form.secondarySkills} onChange={(v) => update("secondarySkills", v)} />
      <CheckboxGroup label="Topics" options={TOPICS} selected={form.topics} onChange={(v) => update("topics", v)} />

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Duration
          <input
            required
            placeholder="e.g. 15 minutes"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Class Size
          <input
            required
            placeholder="e.g. 4-20"
            value={form.classSize}
            onChange={(e) => update("classSize", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Preparation Time
          <input
            required
            placeholder="e.g. 5 minutes"
            value={form.prepTime}
            onChange={(e) => update("prepTime", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Materials <span className="font-normal normal-case text-ink-300">(comma-separated)</span>
        <input
          value={form.materials}
          onChange={(e) => update("materials", e.target.value)}
          className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Related Resources <span className="font-normal normal-case text-ink-300">(slugs, comma-separated)</span>
          <input
            value={form.relatedResources}
            onChange={(e) => update("relatedResources", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Collections <span className="font-normal normal-case text-ink-300">(slugs, comma-separated)</span>
          <input
            value={form.collections}
            onChange={(e) => update("collections", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-700">Downloads</p>
          <button type="button" onClick={addDownload} className="text-xs font-semibold text-brand-700">
            + Add download
          </button>
        </div>
        <div className="mt-2 grid gap-2">
          {form.downloads.map((d, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_1fr_auto] items-center gap-2">
              <input
                placeholder="Label"
                value={d.label}
                onChange={(e) => updateDownload(i, { label: e.target.value })}
                className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
              />
              <select
                value={d.fileType}
                onChange={(e) => updateDownload(i, { fileType: e.target.value as ResourceDownload["fileType"] })}
                className="rounded-lg border border-ink-100 px-2 py-2 text-sm font-normal text-ink-900"
              >
                {["PDF", "DOCX", "PPTX", "Image"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                placeholder="/downloads/file.pdf"
                value={d.url}
                onChange={(e) => updateDownload(i, { url: e.target.value })}
                className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
              />
              <button type="button" onClick={() => removeDownload(i)} className="text-xs font-semibold text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

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

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Author
          <input
            required
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Date Created
          <input
            type="date"
            required
            value={form.dateCreated}
            onChange={(e) => update("dateCreated", e.target.value)}
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>
        <label className="flex items-center gap-2 self-end pb-2.5 text-xs font-semibold text-ink-700">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4"
          />
          Featured
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Resource"}
        </button>
      </div>
    </form>
  );
}
