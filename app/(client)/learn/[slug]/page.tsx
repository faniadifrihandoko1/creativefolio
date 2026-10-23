import { notFound } from "next/navigation";
import { LearnDetailView } from "@/app/components/view/(client)/learn/detail";
import { client } from "@/sanity/lib/client";
import {
  learningPathBySlugQuery,
  learningPathSlugsQuery,
  type SanityLearningPath,
} from "@/sanity/lib/queries";

export const revalidate = 60;

const SITE_URL = "https://fanidev.vercel.app";

export const generateStaticParams = async () => {
  const slugs = await client.fetch<{ slug: string }[]>(learningPathSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
};

interface LearnDetailProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({ params }: LearnDetailProps) => {
  const path = await client.fetch<SanityLearningPath | null>(
    learningPathBySlugQuery,
    { slug: params.slug }
  );
  const title = path?.title || "Learn";
  const description =
    path?.description ||
    "Jalur belajar terkurasi dari artikel-artikel Fani Dev.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
};

export default async function LearnDetailPage({ params }: LearnDetailProps) {
  const path = await client.fetch<SanityLearningPath | null>(
    learningPathBySlugQuery,
    { slug: params.slug }
  );
  if (!path) {
    notFound();
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: path.title,
    description: path.description || undefined,
    numberOfItems: path.lessons?.length ?? 0,
    itemListElement: (path.lessons ?? []).map((lesson, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: lesson.title,
      url: `${SITE_URL}/blogs/${lesson.slug}`,
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LearnDetailView path={path} />
    </>
  );
}
