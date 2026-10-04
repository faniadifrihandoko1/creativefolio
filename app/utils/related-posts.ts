import type { SanityPost } from "@/sanity/lib/queries";

// Cari artikel terkait untuk artikel yang sedang dibaca.
// Prioritas: (1) kategori sama, (2) tag yang sama, (3) fallback artikel terbaru.
// Artikel saat ini selalu dikecualikan.
export function getRelatedPosts(
  posts: SanityPost[],
  currentSlug: string,
  limit = 3
): SanityPost[] {
  const current = posts.find((p) => p.slug === currentSlug);
  const others = posts.filter((p) => p.slug !== currentSlug);
  if (others.length === 0) return [];

  const scored = others.map((post) => {
    let score = 0;
    if (
      current?.category &&
      post.category &&
      post.category === current.category
    ) {
      score += 2;
    }
    if (Array.isArray(post.tags) && Array.isArray(current?.tags)) {
      score += post.tags.filter((tag) => current.tags.includes(tag)).length;
    }
    return { post, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      new Date(b.post.publishedAt).getTime() -
      new Date(a.post.publishedAt).getTime()
    );
  });

  return scored.slice(0, limit).map((s) => s.post);
}
