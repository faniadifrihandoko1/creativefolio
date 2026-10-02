import type { StructureResolver } from "sanity/structure";
import {
  BookIcon,
  ClockIcon,
  DocumentIcon,
  StarIcon,
  TagIcon,
} from "@sanity/icons";

/** Struktur sidebar Studio: dikelompokkan + view terfilter. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Blog")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.listItem()
                .title("Semua Artikel")
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList("post")
                    .title("Semua Artikel")
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("Featured")
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title("Artikel Featured")
                    .filter('_type == "post" && featured == true')
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("Terbaru Dibuat")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("Terbaru Dibuat")
                    .filter('_type == "post"')
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem("tag").title("Tag").icon(TagIcon),
    ]);
