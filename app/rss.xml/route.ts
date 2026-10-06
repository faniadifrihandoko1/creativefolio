import { client } from "@/sanity/lib/client";
import { postsQuery, type SanityPost } from "@/sanity/lib/queries";

const SITE_URL = "https://fanidev.vercel.app";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await client.fetch<SanityPost[]>(postsQuery);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blogs/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(post.author)}</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Fani Dev Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Artikel tentang software development, produktivitas, dan topik menarik lainnya oleh Fani Adi Frihandoko.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
