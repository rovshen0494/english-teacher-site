import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAllResources } from "@/lib/resources";
import { getAllPosts } from "@/lib/blog";
import { getCollections } from "@/lib/collections";
import { GAMES } from "@/lib/games";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/ielts",
    "/young-learners",
    "/resources",
    "/games",
    "/for-schools",
    "/contact",
    "/blog",
  ].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
  }));

  const gameRoutes = GAMES.map((g) => ({
    url: `${SITE.url}/games/${g.slug}`,
    lastModified: new Date(),
  }));

  const [resources, collections, posts] = await Promise.all([
    getAllResources(),
    getCollections(),
    getAllPosts(),
  ]);

  const resourceRoutes = resources.map((r) => ({
    url: `${SITE.url}/resources/${r.slug}`,
    lastModified: r.lastUpdated,
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${SITE.url}/resources/collections/${c.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.date,
  }));

  return [...staticRoutes, ...gameRoutes, ...resourceRoutes, ...collectionRoutes, ...blogRoutes];
}
