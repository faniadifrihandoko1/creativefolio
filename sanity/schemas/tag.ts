import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nama Tag",
      type: "string",
      placeholder: "Contoh: React",
      validation: (Rule) => Rule.required().error("Nama tag wajib diisi."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Terisi otomatis dari nama tag.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required().error("Slug wajib diisi."),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
