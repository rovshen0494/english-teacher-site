import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Tag from "@/components/Tag";
import ResourceCard from "@/components/ResourceCard";
import { getPostBySlug, getRelatedResourcesForPost } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedResourcesForPost(post);

  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Tag tone="brand">{post.category}</Tag>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-ink-300">
          {post.author} &middot;{" "}
          {new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <article
          className="prose mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Related Resources</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-5xl text-center">
        <Link href="/blog" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          &larr; Back to blog
        </Link>
      </div>
    </Container>
  );
}
