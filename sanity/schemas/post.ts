import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const post = defineType({
  name: "post",
  title: "Artikel",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Konten", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Meta" },
    { name: "seo", title: "SEO" },
  ],
  orderings: [
    {
      name: "publishedDesc",
      title: "Tanggal terbit (terbaru)",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "titleAsc",
      title: "Judul (A–Z)",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  fields: [
    // ---- Konten ----
    defineField({
      name: "title",
      title: "Judul Artikel",
      type: "string",
      group: "content",
      description: "Judul utama yang tampil di halaman blog.",
      placeholder: "Contoh: Cara Membuat API dengan Next.js",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(100)
          .error("Judul wajib diisi (10–100 karakter)."),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      group: "content",
      description:
        "Terisi otomatis dari judul. Hati-hati mengubahnya — URL lama jadi tidak berlaku.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required().error("Slug wajib diisi."),
    }),
    defineField({
      name: "excerpt",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "1–2 kalimat pembuka. Tampil di kartu artikel dan hasil pencarian Google.",
      placeholder: "Contoh: Panduan praktis membangun REST API...",
      validation: (Rule) =>
        Rule.max(200).error("Ringkasan maksimal 200 karakter."),
    }),
    defineField({
      name: "body",
      title: "Isi Artikel",
      type: "array",
      group: "content",
      description: "Tulis isi artikel di sini. Bisa pakai heading, quote, dan blok kode.",
      of: [
        { type: "block" },
        { type: "code" },
        {
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Teks alternatif",
              type: "string",
              description: "Deskripsi singkat gambar (penting untuk aksesibilitas & SEO).",
            }),
          ],
        },
      ],
    }),

    // ---- Media ----
    defineField({
      name: "cover",
      title: "Cover Artikel",
      type: "image",
      group: "media",
      description:
        "Gambar sampul. Rasio ideal 1200×630px. Tampil di kartu artikel dan bagian atas halaman.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Teks alternatif",
          type: "string",
          description: "Deskripsi singkat gambar cover.",
        }),
      ],
    }),

    // ---- Meta ----
    defineField({
      name: "publishedAt",
      title: "Tanggal Terbit",
      type: "datetime",
      group: "meta",
      description: "Urutan artikel di halaman blog mengikuti tanggal ini.",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Penulis",
      type: "string",
      group: "meta",
      placeholder: "Fani Adifrihandoko",
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      group: "meta",
      placeholder: "Contoh: Web Development",
    }),
    defineField({
      name: "readTime",
      title: "Waktu Baca",
      type: "string",
      group: "meta",
      description: "Tampil di bawah judul artikel.",
      placeholder: "Contoh: 5 menit",
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "array",
      group: "meta",
      description: "Tag baru dibuat lewat menu Tag di sidebar.",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      description: "Tampilkan artikel ini di bagian pilihan editor.",
      initialValue: false,
    }),

    // ---- SEO ----
    defineField({
      name: "seoTitle",
      title: "Judul SEO",
      type: "string",
      group: "seo",
      description:
        "Judul di tab browser dan hasil Google. Kosongkan untuk memakai judul artikel.",
      placeholder: "Contoh: Cara Membuat API dengan Next.js | FANIDEV",
      validation: (Rule) =>
        Rule.max(60).warning("Idealnya di bawah 60 karakter."),
    }),
    defineField({
      name: "seoDescription",
      title: "Deskripsi SEO",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "Tampil di hasil pencarian Google. Kosongkan untuk memakai ringkasan.",
      validation: (Rule) =>
        Rule.max(160).warning("Idealnya di bawah 160 karakter."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      publishedAt: "publishedAt",
      media: "cover",
    },
    prepare({ title, author, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Belum ada tanggal";
      return {
        title,
        subtitle: `${author || "Tanpa penulis"} • ${date}`,
        media,
      };
    },
  },
});
