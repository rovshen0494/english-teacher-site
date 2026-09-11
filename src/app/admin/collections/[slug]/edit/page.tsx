import { notFound } from "next/navigation";
import CollectionForm from "@/components/admin/CollectionForm";
import { getCollectionBySlug } from "@/lib/collections";

export default async function EditCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit Collection</h1>
      <div className="mt-6 max-w-xl rounded-2xl border border-ink-100 bg-white p-6">
        <CollectionForm collection={collection} />
      </div>
    </div>
  );
}
