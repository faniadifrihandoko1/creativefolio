"use client";

import type { DocumentBadgeProps } from "sanity";
import { ImageIcon, StarIcon } from "@sanity/icons";

/** Badge "Featured" untuk artikel pilihan editor. */
export function FeaturedBadge(props: DocumentBadgeProps) {
  if (props.type !== "post") return null;
  const doc = props.draft || props.published;
  if (!doc || !(doc as { featured?: boolean }).featured) return null;
  return {
    label: "Featured",
    title: "Artikel pilihan editor",
    color: "positive",
    icon: StarIcon,
  };
}

/** Badge peringatan kalau artikel belum punya cover. */
export function NoCoverBadge(props: DocumentBadgeProps) {
  if (props.type !== "post") return null;
  const doc = props.draft || props.published;
  if (!doc || (doc as { cover?: unknown }).cover) return null;
  return {
    label: "Tanpa cover",
    title: "Artikel ini belum punya gambar cover",
    color: "caution",
    icon: ImageIcon,
  };
}
