import { notFound } from "next/navigation";
import { BlogDetailView } from "@/app/components/Pages/Blog/detail-blog";
import { client } from "@/sanity/lib/client";
import {
  postBySlugQuery,
  postSlugsQuery,
  postsQuery,
  type SanityPost,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export const generateStaticParams = async () => {
  const slugs = await client.fetch<{ slug: string }[]>(postSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
};

interface BlogDetailProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({ params }: BlogDetailProps) => {
  const post = await client.fetch<SanityPost | null>(postBySlugQuery, {
    slug: params.slug,
  });
  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt,
  };
};

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const [post, posts] = await Promise.all([
    client.fetch<SanityPost | null>(postBySlugQuery, { slug: params.slug }),
    client.fetch<SanityPost[]>(postsQuery),
  ]);
  if (!post) {
    notFound();
  }
  return <BlogDetailView post={post} posts={posts} />;
}
