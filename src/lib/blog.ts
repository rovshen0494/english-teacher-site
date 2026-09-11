import { marked } from "marked";
import { createClient } from "./supabase/server";
import { getResourceBySlug } from "./resources";
import type { BlogPost, Resource } from "./types";

marked.setOptions({ gfm: true, breaks: false });

interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  related_resources: string[];
  featured: boolean;
  body: string;
}

function mapRow(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    author: row.author,
    relatedResources: row.related_resources,
    featured: row.featured,
    body: row.body ?? "",
    bodyHtml: marked.parse(row.body ?? "", { async: false }) as string,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false });
  if (error) throw error;
  return (data as BlogPostRow[]).map(mapRow);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as BlogPostRow) : undefined;
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", category)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as BlogPostRow[]).map(mapRow);
}

export async function getRelatedResourcesForPost(post: BlogPost): Promise<Resource[]> {
  if (!post.relatedResources?.length) return [];
  const resources = await Promise.all(post.relatedResources.map((slug) => getResourceBySlug(slug)));
  return resources.filter((r): r is Resource => Boolean(r));
}
