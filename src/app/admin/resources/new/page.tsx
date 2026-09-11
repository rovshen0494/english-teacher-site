import ResourceForm from "@/components/admin/ResourceForm";

export default function NewResourcePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New Resource</h1>
      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6">
        <ResourceForm />
      </div>
    </div>
  );
}
