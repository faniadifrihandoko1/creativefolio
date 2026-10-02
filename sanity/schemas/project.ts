import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";
import { TECH_COLORS } from "../lib/techColors";

export const project = defineType({
  name: "project",
  title: "Proyek",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "content", title: "Konten", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Meta" },
  ],
  orderings: [
    {
      name: "orderAsc",
      title: "Urutan tampil",
      by: [
        { field: "order", direction: "asc" },
        { field: "date", direction: "desc" },
      ],
    },
    {
      name: "dateDesc",
      title: "Tanggal (terbaru)",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  fields: [
    // ---- Konten ----
    defineField({
      name: "title",
      title: "Nama Proyek",
      type: "string",
      group: "content",
      placeholder: "Contoh: Circle App",
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(100)
          .error("Nama proyek wajib diisi (3–100 karakter)."),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      group: "content",
      description: "Terisi otomatis dari nama proyek.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required().error("Slug wajib diisi."),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 4,
      group: "content",
      description: "Ceritakan apa itu proyek ini dan fitur utamanya.",
      placeholder: "Contoh: Aplikasi social media berbasis web...",
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .max(500)
          .error("Deskripsi wajib diisi (20–500 karakter)."),
    }),
    defineField({
      name: "url",
      title: "Link Proyek",
      type: "url",
      group: "content",
      description: "Link demo/live atau repository. Dibuka di tab baru.",
      placeholder: "https://...",
      validation: (Rule) =>
        Rule.required()
          .uri({ scheme: ["http", "https"] })
          .error("Isi URL yang valid, diawali http(s)://"),
    }),

    // ---- Media ----
    defineField({
      name: "image",
      title: "Gambar Proyek",
      type: "image",
      group: "media",
      description: "Screenshot/tampilan proyek. Rasio ideal 5:3.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Teks alternatif",
          type: "string",
          description: "Deskripsi singkat gambar.",
        }),
      ],
    }),

    // ---- Meta ----
    defineField({
      name: "date",
      title: "Tanggal",
      type: "date",
      group: "meta",
      description: "Bulan dan tahun tampil sebagai mis. June 2024.",
      validation: (Rule) => Rule.required().error("Tanggal wajib diisi."),
    }),
    defineField({
      name: "technologies",
      title: "Teknologi",
      type: "array",
      group: "meta",
      description: "Daftar teknologi yang dipakai di proyek ini.",
      of: [
        defineField({
          name: "technology",
          title: "Teknologi",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nama",
              type: "string",
              placeholder: "Contoh: ReactJS",
              validation: (Rule) => Rule.required().error("Nama wajib diisi."),
            }),
            defineField({
              name: "color",
              title: "Warna Badge",
              type: "string",
              options: { list: TECH_COLORS, layout: "dropdown" },
              initialValue: "bg-blue-500",
              validation: (Rule) => Rule.required().error("Warna wajib dipilih."),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "color" },
          },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      description: "Tandai sebagai proyek unggulan.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Urutan Tampil",
      type: "number",
      group: "meta",
      description: "Angka kecil tampil lebih dulu.",
      initialValue: 0,
      validation: (Rule) =>
        Rule.required().min(0).error("Urutan wajib diisi (angka ≥ 0)."),
    }),
  ],
  preview: {
    select: { title: "title", date: "date", media: "image" },
    prepare({ title, date, media }) {
      const formatted = date
        ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Belum ada tanggal";
      return { title, subtitle: formatted, media };
    },
  },
});
