import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  learningPathSlugsQuery,
  postSlugsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

const SITE_URL = "https://fanidev.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, paths] = await Promise.all([
    client.fetch<{ slug: string }[]>(postSlugsQuery),
    client.fetch<{ slug: string }[]>(learningPathSlugsQuery),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learn`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blogs/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const pathRoutes: MetadataRoute.Sitemap = paths.map((p) => ({
    url: `${SITE_URL}/learn/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...pathRoutes];
}
