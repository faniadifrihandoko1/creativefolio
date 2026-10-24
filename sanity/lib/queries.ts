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

// ---- Jalur Belajar (learningPath) ----

export const learningPathsQuery = groq`
  *[_type == "learningPath"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    level,
    order,
    "lessonCount": count(lessons),
    "lessons": lessons[]->{
      title,
      "slug": slug.current,
      readTime
    },
    "branches": branches[]{
      _key,
      label,
      "lessons": lessons[]->{
        title,
        "slug": slug.current,
        readTime
      }
    }
  }
`;

export const learningPathSlugsQuery = groq`
  *[_type == "learningPath" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const learningPathBySlugQuery = groq`
  *[_type == "learningPath" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    level,
    order,
    "lessonCount": count(lessons),
    "lessons": lessons[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      readTime,
      category,
      publishedAt,
      "coverUrl": cover.asset->url,
      "coverAlt": cover.alt
    },
    "branches": branches[]{
      _key,
      label,
      "afterSlug": afterLesson->slug.current,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        readTime,
        category,
        publishedAt,
        "coverUrl": cover.asset->url,
        "coverAlt": cover.alt
      }
    }
  }
`;

export interface SanityLearningLesson {
  _id?: string;
  title?: string;
  slug: string;
  excerpt?: string | null;
  readTime?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
}

export interface SanityLearningBranch {
  _key: string;
  label: string;
  afterSlug?: string | null;
  lessons: SanityLearningLesson[];
}

export interface SanityLearningPath {
  _id: string;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  order: number;
  lessonCount: number;
  lessons: SanityLearningLesson[];
  branches?: SanityLearningBranch[] | null;
}

// ---- Keanggotaan artikel di jalur belajar (untuk halaman artikel) ----

export const postPathsQuery = groq`
  *[_type == "learningPath" && (
    $slug in lessons[]->slug.current ||
    $slug in branches[].lessons[]->slug.current
  )] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    "lessons": lessons[]->{
      "slug": slug.current,
      title
    },
    "branches": branches[]{
      _key,
      label,
      "afterSlug": afterLesson->slug.current,
      "lessons": lessons[]->{
        "slug": slug.current,
        title
      }
    }
  }
`;

export interface SanityPathLessonRef {
  slug: string;
  title: string;
}

export interface SanityPostPathBranch {
  _key: string;
  label: string;
  afterSlug: string | null;
  lessons: SanityPathLessonRef[];
}

export interface SanityPostPath {
  _id: string;
  title: string;
  slug: string;
  lessons: SanityPathLessonRef[];
  branches: SanityPostPathBranch[] | null;
}
