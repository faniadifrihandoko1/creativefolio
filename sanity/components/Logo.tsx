"use client";

/** Logo pixel "F" FANIDEV untuk branding Sanity Studio. */
const PIXEL_F = [
  "#######",
  "#......",
  "#......",
  "#####..",
  "#......",
  "#......",
  "#......",
  "#......",
  "#......",
];

export function Logo() {
  return (
    <svg width={30} height={34} viewBox="0 0 9 11" aria-label="FANIDEV CMS">
      <rect width="9" height="11" rx="2" fill="#1e1b4b" />
      {PIXEL_F.flatMap((row, y) =>
        row.split("").flatMap((ch, x) =>
          ch === "#"
            ? [
                <rect
                  key={`${x}-${y}`}
                  x={x + 1}
                  y={y + 1}
                  width={1}
                  height={1}
                  fill="#4ade80"
                />,
              ]
            : []
        )
      )}
    </svg>
  );
}
