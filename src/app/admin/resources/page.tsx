import Link from "next/link";
import { getAllResources } from "@/lib/resources";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminResourcesPage() {
  const resources = await getAllResources();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Resources</h1>
        <Link
          href="/admin/resources/new"
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + New Resource
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 bg-background text-xs uppercase tracking-wide text-ink-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Ages</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.slug} className="border-b border-ink-100 last:border-0">
                <td className="px-4 py-3 font-medium text-ink-900">{r.title}</td>
                <td className="px-4 py-3 text-ink-500">{r.resourceType}</td>
                <td className="px-4 py-3 text-ink-500">{r.ageGroups.join(", ")}</td>
                <td className="px-4 py-3 text-ink-500">{r.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/resources/${r.slug}/edit`} className="text-xs font-semibold text-brand-700">
                      Edit
                    </Link>
                    <DeleteButton table="resources" matchColumn="slug" matchValue={r.slug} confirmLabel={r.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {resources.length === 0 && <p className="p-6 text-sm text-ink-500">No resources yet.</p>}
      </div>
    </div>
  );
}
