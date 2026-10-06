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
  "tags": tag[]->name,
  seoTitle,
  seoDescription
`;

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postFields},
    body
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, date desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    date,
    url,
    featured,
    order,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    "technologies": technologies[]{name, color}
  }
`;

export interface SanityTechnology {
  name: string;
  color: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  url: string;
  featured: boolean;
  order: number;
  imageUrl: string | null;
  imageAlt: string | null;
  technologies: SanityTechnology[];
}

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
  seoTitle?: string | null;
  seoDescription?: string | null;
  body?: unknown;
}
