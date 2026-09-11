import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New Blog Post</h1>
      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6">
        <BlogForm />
      </div>
    </div>
  );
}
