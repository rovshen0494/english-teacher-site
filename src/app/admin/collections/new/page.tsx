import CollectionForm from "@/components/admin/CollectionForm";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New Collection</h1>
      <div className="mt-6 max-w-xl rounded-2xl border border-ink-100 bg-white p-6">
        <CollectionForm />
      </div>
    </div>
  );
}
