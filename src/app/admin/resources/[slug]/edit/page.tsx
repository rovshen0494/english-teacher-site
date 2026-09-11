import { notFound } from "next/navigation";
import ResourceForm from "@/components/admin/ResourceForm";
import { getResourceBySlug } from "@/lib/resources";

export default async function EditResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit Resource</h1>
      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6">
        <ResourceForm resource={resource} />
      </div>
    </div>
  );
}
