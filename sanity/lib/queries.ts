import { groq } from "next-sanity";

export const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  publishedAt,
  readTime,
  category,
  featured,
  "coverUrl": cover.asset->url,
  "coverAlt": cover.alt,
  "tags": tag[]->name
`;

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body
  }
`;

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  featured: boolean;
  coverUrl: string | null;
  coverAlt: string | null;
  tags: string[];
  body?: unknown;
}
