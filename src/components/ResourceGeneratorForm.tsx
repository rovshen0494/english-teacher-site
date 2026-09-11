"use client";

import { useState } from "react";
import {
  AGE_GROUPS,
  DIFFICULTIES,
  ENGLISH_LEVELS,
  RESOURCE_TYPES,
  SKILLS,
  TOPICS,
} from "@/lib/constants";

export default function ResourceGeneratorForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="grid gap-5 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Resource Type
          <select className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900" required>
            {RESOURCE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Age Group
          <select className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900" required>
            {AGE_GROUPS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Level
          <select className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900" required>
            {ENGLISH_LEVELS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Topic
          <select className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900" required>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Skill
          <select className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900" required>
            {SKILLS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Duration
          <input
            type="text"
            placeholder="e.g. 15 minutes"
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Class Size
          <input
            type="text"
            placeholder="e.g. 4-20 students"
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Difficulty
          <select className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900">
            {DIFFICULTIES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700 sm:col-span-2">
          Learning Objective
          <textarea
            rows={3}
            placeholder="What should students be able to do after this activity?"
            className="rounded-lg border border-ink-100 px-3 py-2 text-sm font-normal text-ink-900"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Generate Draft
          </button>
        </div>
      </form>

      {submitted && (
        <div className="mt-6 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-4 text-sm text-brand-700">
          <strong className="block font-semibold">AI Resource Generator — Coming Soon</strong>
          This prototype form is not yet connected to an AI generation service. Once enabled, a
          draft resource will be created here for teacher review — nothing is ever published
          automatically.
        </div>
      )}
    </div>
  );
}
