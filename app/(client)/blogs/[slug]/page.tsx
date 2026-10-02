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
  const title = post?.seoTitle || post?.title || "Blog";
  const description = post?.seoDescription || post?.excerpt;
  const images = post?.coverUrl ? [post.coverUrl] : [];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "article",
      publishedTime: post?.publishedAt,
      authors: post?.author ? [post.author] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl || undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailView post={post} posts={posts} />
    </>
  );
}
