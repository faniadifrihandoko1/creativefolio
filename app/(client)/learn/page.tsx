import { Metadata } from "next";
import { LearnView } from "@/app/components/view/(client)/learn";
import { client } from "@/sanity/lib/client";
import {
  learningPathsQuery,
  type SanityLearningPath,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Learn | Fani Dev",
  description:
    "Jalur belajar terkurasi dari artikel-artikel Fani Dev — belajar web development langkah demi langkah, dari fondasi HTML & CSS sampai React & Next.js.",
  openGraph: {
    title: "Learn | Fani Dev",
    description:
      "Jalur belajar terkurasi dari artikel-artikel Fani Dev — belajar web development langkah demi langkah, dari fondasi HTML & CSS sampai React & Next.js.",
    type: "website",
  },
};

export default async function LearnPage() {
  const paths = await client.fetch<SanityLearningPath[]>(learningPathsQuery);
  return <LearnView paths={paths} />;
}
