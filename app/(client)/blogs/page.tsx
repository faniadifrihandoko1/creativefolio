import { BlogsView } from "@/app/components/view/(client)/blogs";
import { client } from "@/sanity/lib/client";
import { postsQuery, type SanityPost } from "@/sanity/lib/queries";

export const revalidate = 60;

export default async function BlogsPage() {
  const posts = await client.fetch<SanityPost[]>(postsQuery);
  return <BlogsView posts={posts} />;
}
