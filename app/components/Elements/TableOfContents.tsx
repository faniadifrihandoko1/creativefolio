export interface TocHeading {
  id: string;
  text: string;
  level: number; // 2 | 3 | 4
}

// Ambil heading (h2-h4) dari Portable Text body.
// id memakai _key block sehingga dijamin unik.
export function getHeadings(body: unknown): TocHeading[] {
  if (!Array.isArray(body)) return [];
  return body
    .filter(
      (b): b is { _key: string; style: string; children: { text?: string }[] } =>
        !!b &&
        b._type === "block" &&
        ["h2", "h3", "h4"].includes(b.style) &&
        Array.isArray(b.children)
    )
    .map((b) => ({
      id: b._key,
      text: b.children.map((c) => c.text || "").join(""),
      level: parseInt(b.style.replace("h", ""), 10),
    }))
    .filter((h) => h.text.trim().length > 0);
}

export const TableOfContents = ({
  headings,
}: {
  headings: TocHeading[];
}) => {
  if (headings.length === 0) return null;
  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              style={{ paddingLeft: `${(h.level - 2) * 0.75}rem` }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
