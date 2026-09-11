import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ResourceCard from "@/components/ResourceCard";
import { getResourcesByCollection } from "@/lib/resources";
import { getCollectionBySlug } from "@/lib/collections";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const resources = await getResourcesByCollection(slug);

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading eyebrow="Collection" title={collection.title} description={collection.description} />

      {resources.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink-500">Resources are being added to this collection soon.</p>
      )}
    </Container>
  );
}
