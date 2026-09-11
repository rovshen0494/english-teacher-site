"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResourceCard from "./ResourceCard";
import {
  AGE_GROUP_LABELS,
  AGE_GROUPS,
  DIFFICULTIES,
  DURATIONS,
  ENGLISH_LEVELS,
  RESOURCE_TYPES,
  SKILLS,
  TOPICS,
} from "@/lib/constants";
import type { Resource } from "@/lib/types";

const OPTION_LABELS: Partial<Record<string, string>> = AGE_GROUP_LABELS;

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {OPTION_LABELS[opt] ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function durationMatches(resourceDuration: string, bucket: string): boolean {
  const num = parseInt(resourceDuration, 10);
  if (Number.isNaN(num)) return false;
  const ranges: Record<string, [number, number]> = {
    "5-10 minutes": [5, 10],
    "10-15 minutes": [10, 15],
    "15-20 minutes": [15, 20],
    "20-30 minutes": [20, 30],
    "30-45 minutes": [30, 45],
    "45-60 minutes": [45, 60],
  };
  const range = ranges[bucket];
  if (!range) return true;
  return num >= range[0] && num <= range[1];
}

export default function ResourceLibrary({ resources }: { resources: Resource[] }) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [age, setAge] = useState(searchParams.get("age") ?? "");
  const [level, setLevel] = useState(searchParams.get("level") ?? "");
  const [skill, setSkill] = useState(searchParams.get("skill") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [topic, setTopic] = useState(searchParams.get("topic") ?? "");
  const [duration, setDuration] = useState(searchParams.get("duration") ?? "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (age && !r.ageGroups.includes(age as Resource["ageGroups"][number])) return false;
      if (level && !r.englishLevels.includes(level as Resource["englishLevels"][number])) return false;
      if (skill && r.primarySkill !== skill && !r.secondarySkills.includes(skill as Resource["primarySkill"]))
        return false;
      if (type && r.resourceType !== type) return false;
      if (topic && !r.topics.includes(topic)) return false;
      if (difficulty && r.difficulty !== difficulty) return false;
      if (duration && !durationMatches(r.duration, duration)) return false;
      if (q) {
        const haystack = `${r.title} ${r.description} ${r.topics.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [resources, query, age, level, skill, type, topic, duration, difficulty]);

  const clearFilters = () => {
    setQuery("");
    setAge("");
    setLevel("");
    setSkill("");
    setType("");
    setTopic("");
    setDuration("");
    setDifficulty("");
  };

  const hasFilters = Boolean(query || age || level || skill || type || topic || duration || difficulty);

  return (
    <div>
      <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Search Resources
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try &ldquo;vocabulary&rdquo;, &ldquo;speaking&rdquo;, &ldquo;IELTS&rdquo;..."
            className="rounded-lg border border-ink-100 px-4 py-2.5 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          <FilterSelect label="Age" value={age} onChange={setAge} options={AGE_GROUPS} />
          <FilterSelect label="Level" value={level} onChange={setLevel} options={ENGLISH_LEVELS} />
          <FilterSelect label="Skill" value={skill} onChange={setSkill} options={SKILLS} />
          <FilterSelect label="Resource Type" value={type} onChange={setType} options={RESOURCE_TYPES} />
          <FilterSelect label="Topic" value={topic} onChange={setTopic} options={TOPICS} />
          <FilterSelect label="Duration" value={duration} onChange={setDuration} options={DURATIONS} />
          <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={DIFFICULTIES} />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 text-xs font-semibold text-brand-700 hover:text-brand-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      <p className="mt-6 text-sm text-ink-500">
        Showing <span className="font-semibold text-ink-900">{filtered.length}</span> of{" "}
        {resources.length} resources
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-100 p-10 text-center text-sm text-ink-500">
          No resources match your filters yet. Try clearing a filter or searching a different term.
        </div>
      )}
    </div>
  );
}
