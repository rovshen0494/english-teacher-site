import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAllResources } from "@/lib/resources";
import { getAllPosts } from "@/lib/blog";
import { COLLECTIONS } from "@/lib/resources";
import { GAMES } from "@/lib/games";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const resourceRoutes = getAllResources().map((r) => ({
    url: `${SITE.url}/resources/${r.slug}`,
    lastModified: r.lastUpdated,
  }));

  const collectionRoutes = COLLECTIONS.map((c) => ({
    url: `${SITE.url}/resources/collections/${c.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = getAllPosts().map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.date,
  }));

  return [...staticRoutes, ...gameRoutes, ...resourceRoutes, ...collectionRoutes, ...blogRoutes];
}
