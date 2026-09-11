import Link from "next/link";
import Tag from "./Tag";
import { AGE_GROUP_LABELS } from "@/lib/constants";
import type { Resource } from "@/lib/types";

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
    >
      <div className="flex flex-wrap gap-2">
        <Tag tone="brand">{resource.resourceType}</Tag>
        <Tag>{resource.difficulty}</Tag>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 group-hover:text-brand-700">
        {resource.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
        {resource.description}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-ink-500">
        <div>
          <dt className="font-semibold text-ink-700">Age</dt>
          <dd>{resource.ageGroups.map((a) => AGE_GROUP_LABELS[a] ?? a).join(", ")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-700">Level</dt>
          <dd>{resource.englishLevels.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-700">Skill</dt>
          <dd>{resource.primarySkill}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-700">Duration</dt>
          <dd>{resource.duration}</dd>
        </div>
      </dl>

      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
        View Resource
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
