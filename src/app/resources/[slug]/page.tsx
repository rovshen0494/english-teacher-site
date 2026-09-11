import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Tag from "@/components/Tag";
import ResourceCard from "@/components/ResourceCard";
import { PrintButton, FavouriteButton } from "@/components/ResourceActions";
import { getRelatedResources, getResourceBySlug } from "@/lib/resources";
import { AGE_GROUP_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: "article",
    },
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const related = await getRelatedResources(resource);

  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <Tag tone="brand">{resource.resourceType}</Tag>
          <Tag>{resource.difficulty}</Tag>
          {resource.topics.map((topic) => (
            <Tag key={topic}>{topic}</Tag>
          ))}
        </div>

        <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          {resource.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-500">{resource.description}</p>

        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-ink-100 bg-white p-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">Ages</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {resource.ageGroups.map((a) => AGE_GROUP_LABELS[a] ?? a).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">Level</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">{resource.englishLevels.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">Duration</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">{resource.duration}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">Skills</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">
              {resource.primarySkill}
              {resource.secondarySkills.length > 0 ? ` + ${resource.secondarySkills.join(", ")}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">Class Size</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">{resource.classSize}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">Difficulty</dt>
            <dd className="mt-1 text-sm font-medium text-ink-900">{resource.difficulty}</dd>
          </div>
        </dl>

        <article
          className="prose mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: resource.bodyHtml }}
        />

        {resource.downloads && resource.downloads.length > 0 && (
          <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink-900">Downloads</h2>
            <ul className="mt-4 space-y-2">
              {resource.downloads.map((file) => (
                <li key={file.url}>
                  <a
                    href={file.url}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800"
                  >
                    <span aria-hidden>↓</span>
                    {file.label} ({file.fileType})
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-300">
              Placeholder files — real downloadable materials will replace these before launch.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <PrintButton />
          {resource.downloads && resource.downloads[0] && (
            <a
              href={resource.downloads[0].url}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Download PDF
            </a>
          )}
          <FavouriteButton slug={resource.slug} />
        </div>

        <p className="mt-6 text-xs text-ink-300">
          Author: {resource.author} &middot; Last updated{" "}
          {new Date(resource.lastUpdated).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-5xl">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Related Resources</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-5xl text-center">
        <Link href="/resources" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          &larr; Back to all resources
        </Link>
      </div>
    </Container>
  );
}
