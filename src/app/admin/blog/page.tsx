import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 bg-background text-xs uppercase tracking-wide text-ink-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug} className="border-b border-ink-100 last:border-0">
                <td className="px-4 py-3 font-medium text-ink-900">{p.title}</td>
                <td className="px-4 py-3 text-ink-500">{p.category}</td>
                <td className="px-4 py-3 text-ink-500">{p.date}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/blog/${p.slug}/edit`} className="text-xs font-semibold text-brand-700">
                      Edit
                    </Link>
                    <DeleteButton table="blog_posts" matchColumn="slug" matchValue={p.slug} confirmLabel={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-sm text-ink-500">No blog posts yet.</p>}
      </div>
    </div>
  );
}
