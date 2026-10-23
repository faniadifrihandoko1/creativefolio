import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

/**
 * Jalur Belajar (learningPath) — kurikulum terurut untuk halaman /learn.
 * Satu jalur berisi daftar referensi artikel (post) yang urutannya
 * adalah urutan belajar. Dikelola penuh dari Studio (Opsi B, DEL-104).
 */
export const learningPath = defineType({
  name: "learningPath",
  title: "Jalur Belajar",
  type: "document",
  icon: RocketIcon,
  groups: [
    { name: "content", title: "Konten", default: true },
    { name: "curriculum", title: "Kurikulum" },
  ],
  orderings: [
    {
      name: "orderAsc",
      title: "Urutan tampil",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nama Jalur",
      type: "string",
      group: "content",
      description: "Nama jalur belajar, tampil sebagai judul kartu di /learn.",
      placeholder: "Contoh: Fondasi Web — HTML & CSS",
      validation: (Rule) =>
        Rule.required()
          .min(5)
          .max(80)
          .error("Nama jalur wajib diisi (5–80 karakter)."),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      group: "content",
      description:
        "Terisi otomatis dari nama jalur. Menjadi URL /learn/<slug>. Hati-hati mengubahnya — URL lama jadi tidak berlaku.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required().error("Slug wajib diisi."),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "1–2 kalimat: jalur ini untuk siapa dan apa hasilnya setelah selesai.",
      placeholder:
        "Contoh: Mulai dari nol sampai bisa membuat layout web yang rapi dan responsif.",
      validation: (Rule) =>
        Rule.max(240).error("Deskripsi maksimal 240 karakter."),
    }),
    defineField({
      name: "level",
      title: "Tingkat",
      type: "string",
      group: "content",
      description: "Tingkat kesulitan jalur, tampil sebagai lencana di kartu.",
      options: {
        list: [
          { title: "Pemula", value: "Pemula" },
          { title: "Pemula–Menengah", value: "Pemula–Menengah" },
          { title: "Menengah", value: "Menengah" },
          { title: "Menengah–Lanjut", value: "Menengah–Lanjut" },
          { title: "Semua Level", value: "Semua Level" },
        ],
        layout: "radio",
      },
      initialValue: "Pemula",
      validation: (Rule) => Rule.required().error("Tingkat wajib dipilih."),
    }),
    defineField({
      name: "order",
      title: "Urutan Tampil",
      type: "number",
      group: "content",
      description:
        "Urutan kartu jalur di halaman /learn (angka kecil tampil lebih dulu).",
      initialValue: 0,
    }),
    defineField({
      name: "lessons",
      title: "Materi (urut dari pertama sampai terakhir)",
      type: "array",
      group: "curriculum",
      description:
        "Seret untuk mengubah urutan belajar. Satu artikel hanya boleh muncul sekali dalam satu jalur.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (Rule) => [
        Rule.min(1).error("Satu jalur minimal berisi 1 materi."),
        Rule.unique().error("Ada artikel yang dobel dalam jalur ini."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      level: "level",
      lessons: "lessons",
    },
    prepare({ title, level, lessons }) {
      const count = Array.isArray(lessons) ? lessons.length : 0;
      return {
        title,
        subtitle: `${level || "Tanpa tingkat"} • ${count} materi`,
      };
    },
  },
});
