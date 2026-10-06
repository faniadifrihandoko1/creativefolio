import type { SanityPost } from "@/sanity/lib/queries";

import { extractTextFromBlocks } from "./portable-text";

// Filter artikel berdasarkan query: cocokkan judul, excerpt, dan isi artikel
// (body Portable Text yang diekstrak jadi plain text). Case-insensitive.
export function searchPosts(posts: SanityPost[], query: string): SanityPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;

  return posts.filter((post) => {
    if (post.title.toLowerCase().includes(q)) return true;
    if (post.excerpt.toLowerCase().includes(q)) return true;
    const bodyText = extractTextFromBlocks(post.body).toLowerCase();
    return bodyText.includes(q);
  });
}
