"use client";

import type { DocumentBadgeDescription, DocumentBadgeProps } from "sanity";
import { ImageIcon, StarIcon } from "@sanity/icons";

/** Badge "Featured" untuk artikel pilihan editor. */
export function FeaturedBadge(
  props: DocumentBadgeProps
): DocumentBadgeDescription | null {
  if (props.type !== "post") return null;
  const doc = props.draft || props.published;
  if (!doc || !(doc as { featured?: boolean }).featured) return null;
  return {
    label: "Featured",
    title: "Artikel pilihan editor",
    color: "success",
    icon: StarIcon,
  };
}

/** Badge peringatan kalau proyek belum punya gambar. */
export function NoImageBadge(
  props: DocumentBadgeProps
): DocumentBadgeDescription | null {
  if (props.type !== "project") return null;
  const doc = props.draft || props.published;
  if (!doc || (doc as { image?: unknown }).image) return null;
  return {
    label: "Tanpa gambar",
    title: "Proyek ini belum punya gambar",
    color: "warning",
    icon: ImageIcon,
  };
}
/** Badge peringatan kalau artikel belum punya cover. */
export function NoCoverBadge(
  props: DocumentBadgeProps
): DocumentBadgeDescription | null {
  if (props.type !== "post") return null;
  const doc = props.draft || props.published;
  if (!doc || (doc as { cover?: unknown }).cover) return null;
  return {
    label: "Tanpa cover",
    title: "Artikel ini belum punya gambar cover",
    color: "warning",
    icon: ImageIcon,
  };
}
