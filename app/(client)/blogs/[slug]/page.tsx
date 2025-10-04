import { BlogDetailView } from "@/app/components/Pages/Blog/detail-blog";

export const generateStaticParams = async () => {
  return [
    { slug: "building-modern-web-applications-with-nextjs-14" },
    { slug: "the-art-of-clean-code-best-practices-for-developers" },
    { slug: "design-systems-creating-consistent-user-experiences" },
    { slug: "performance-optimization-techniques-for-react-applications" },
  ];
};

interface BlogDetailProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({ params }: BlogDetailProps) => {
  return {
    title: params.slug,
  };
};

export default function BlogDetailPage({ params }: BlogDetailProps) {
  return <BlogDetailView params={params} />;
}
