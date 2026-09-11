import { readContentDir, readContentFile } from "./markdown";
import { getResourceBySlug } from "./resources";
import type { BlogFrontmatter, BlogPost, Resource } from "./types";

const DIR = "blog";

let cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = readContentDir(DIR);
  const posts = files.map((file) => {
    const { data, bodyHtml } = readContentFile<BlogFrontmatter>(DIR, file);
    return { ...data, bodyHtml };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getRelatedResourcesForPost(post: BlogPost): Resource[] {
  if (!post.relatedResources?.length) return [];
  return post.relatedResources
    .map((slug) => getResourceBySlug(slug))
    .filter((r): r is Resource => Boolean(r));
}
