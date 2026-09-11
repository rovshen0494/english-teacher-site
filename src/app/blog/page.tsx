import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Tag from "@/components/Tag";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Teaching ideas, IELTS tips and English learning advice for parents, students and teachers.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = getAllPosts().filter((p) => !category || p.category === category);

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="Blog"
        title="Teaching Ideas & IELTS Tips"
        description="Practical articles for parents, students and teachers, linked to relevant resources in the library."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !category ? "bg-brand-700 text-white" : "border border-ink-100 text-ink-700 hover:border-brand-300"
          }`}
        >
          All
        </Link>
        {BLOG_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              category === cat ? "bg-brand-700 text-white" : "border border-ink-100 text-ink-700 hover:border-brand-300"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <Tag tone="brand" className="self-start">
                {post.category}
              </Tag>
              <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
              <p className="mt-4 text-xs text-ink-300">
                {new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink-500">No articles in this category yet.</p>
      )}
    </Container>
  );
}
