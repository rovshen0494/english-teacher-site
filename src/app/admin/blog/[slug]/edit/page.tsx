import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getPostBySlug } from "@/lib/blog";

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit Blog Post</h1>
      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
