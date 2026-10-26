"use client";
import Link from "next/link";
import { FaCheck, FaClock, FaCodeBranch, FaLayerGroup } from "react-icons/fa";

import type {
  SanityLearningBranch,
  SanityLearningGroup,
  SanityLearningLesson,
} from "@/sanity/lib/queries";

/**
 * Diagram peta organik gaya roadmap.sh (DEL-109, desktop only).
 * Menggantikan garis lurus timeline dengan spine biru yang berkelok,
 * kurva berpanah yang memancar ke kiri-kanan, dan kotak-kotak kecil
 * ber-border hitam. Posisi, lebar, dan jarak antar baris dibuat
 * bervariasi secara deterministik (pola dari indeks baris) supaya
 * terasa ditempatkan manual, bukan hasil grid — tapi tetap stabil
 * saat data yang sama dirender ulang.
 *
 * - Kotak cokelat muda = materi utama, kuning = materi berikutnya,
 *   abu-abu = cabang opsional, border hijau + centang = selesai.
 * - Grup (klaster sejalur) dan cabang (opsional) tampil sebagai
 *   tumpukan kotak berlabel: grup berkonektor solid, cabang
 *   putus-putus.
 */

export type DiagramItem =
  | { type: "lesson"; lesson: SanityLearningLesson; index: number }
  | { type: "group"; group: SanityLearningGroup }
  | { type: "branch"; branch: SanityLearningBranch };

export function buildDiagramItems(
  lessons: SanityLearningLesson[],
  groups: SanityLearningGroup[],
  branches: SanityLearningBranch[]
): DiagramItem[] {
  const items: DiagramItem[] = [];
  const placed = new Set<string>();
  lessons.forEach((lesson, index) => {
    items.push({ type: "lesson", lesson, index });
    groups
      .filter((g) => g.afterSlug === lesson.slug)
      .forEach((group) => {
        placed.add(`g:${group._key}`);
        items.push({ type: "group", group });
      });
    branches
      .filter((b) => b.afterSlug === lesson.slug)
      .forEach((branch) => {
        placed.add(`b:${branch._key}`);
        items.push({ type: "branch", branch });
      });
  });
  groups
    .filter((g) => !placed.has(`g:${g._key}`))
    .forEach((group) => items.push({ type: "group", group }));
  branches
    .filter((b) => !placed.has(`b:${b._key}`))
    .forEach((branch) => items.push({ type: "branch", branch }));
  return items;
}

/** Materi rute utama dalam urutan tampil (utama + grup setelah jangkarnya). */
export function getOrderedMainLessons(
  lessons: SanityLearningLesson[],
  groups: SanityLearningGroup[]
): SanityLearningLesson[] {
  const ordered: SanityLearningLesson[] = [];
  const placed = new Set<string>();
  lessons.forEach((lesson) => {
    ordered.push(lesson);
    groups
      .filter((g) => g.afterSlug === lesson.slug)
      .forEach((group) => {
        placed.add(group._key);
        ordered.push(...(group.lessons ?? []));
      });
  });
  groups
    .filter((g) => !placed.has(g._key))
    .forEach((group) => ordered.push(...(group.lessons ?? [])));
  return ordered;
}

// ---- Layout deterministik bervariasi (pola dari indeks baris) ----

const BOARD_W = 1024;
const NODE_H = 80;
const ROW_GAPS = [64, 92, 72, 104, 80, 96, 68, 112];
const SPINE_X = [520, 470, 580, 500, 610, 530, 590, 480, 560, 520];
const EDGE_GAPS = [60, 100, 80, 120, 70, 95];
const BOWS = [-26, 18, -14, 30, -20, 12];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function nodeWidth(title: string): number {
  return clamp(190 + (title?.length ?? 0) * 2.2, 240, 330);
}

function stackHeight(count: number): number {
  return 34 + count * 62 + 12;
}

interface PlacedRow {
  item: DiagramItem;
  top: number;
  height: number;
  centerY: number;
  spineX: number;
  side: "left" | "right";
  /** Tepi kotak yang menghadap spine (x tempat kurva berakhir). */
  edgeX: number;
  /** x kiri kotak. */
  x: number;
  width: number;
}

function layoutRows(items: DiagramItem[]): {
  rows: PlacedRow[];
  totalH: number;
  spineEndX: number;
} {
  const rows: PlacedRow[] = [];
  let y = 170; // ruang untuk legenda di kanan atas
  let side: "left" | "right" = "left";
  items.forEach((item, i) => {
    const isStack = item.type !== "lesson";
    const width = isStack
      ? clamp(280 + ((item.type === "group" ? item.group.label : item.branch.label)?.length ?? 0) * 2, 290, 340)
      : nodeWidth(item.lesson.title ?? item.lesson.slug);
    const height = isStack
      ? stackHeight(
          (item.type === "group" ? item.group.lessons : item.branch.lessons)
            .length
        )
      : NODE_H;
    const spineX = SPINE_X[i % SPINE_X.length];
    const gap = EDGE_GAPS[i % EDGE_GAPS.length];
    let x: number;
    if (side === "left") {
      x = clamp(spineX - gap - width, 20, BOARD_W - 40);
    } else {
      x = clamp(spineX + gap, 20, BOARD_W - 40);
      if (x + width > BOARD_W - 20) x = BOARD_W - 20 - width;
    }
    const edgeX = side === "left" ? x + width : x;
    rows.push({
      item,
      top: y,
      height,
      centerY: y + height / 2,
      spineX,
      side,
      edgeX,
      x,
      width,
    });
    y += height + ROW_GAPS[i % ROW_GAPS.length];
    side = side === "left" ? "right" : "left";
  });
  const totalH = y + 60;
  return { rows, totalH, spineEndX: rows[rows.length - 1]?.spineX ?? 600 };
}

function spinePath(rows: PlacedRow[]): string {
  if (rows.length === 0) return "";
  const pts = rows.map((r) => [r.spineX, r.centerY] as const);
  let d = `M ${pts[0][0]},${pts[0][1] - 100}`;
  for (let i = 0; i < pts.length; i++) {
    const [x, cy] = pts[i];
    const prevY = i === 0 ? cy - 100 : pts[i - 1][1];
    const midY = (prevY + cy) / 2;
    d += ` C ${pts[i - 1]?.[0] ?? x},${midY} ${x},${midY} ${x},${cy}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0]},${last[1] + 90}`;
  return d;
}

const SmallToggle = ({
  done,
  title,
  onToggle,
}: {
  done: boolean;
  title?: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={done}
    aria-label={
      done ? `Tandai "${title}" belum selesai` : `Tandai "${title}" selesai`
    }
    title={done ? "Tandai belum selesai" : "Tandai selesai"}
    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
      done
        ? "bg-green-600 border-green-600 text-white"
        : "border-gray-900/30 dark:border-white/40 text-transparent hover:border-amber-500 hover:text-amber-200"
    }`}
  >
    <FaCheck className="text-[10px]" />
  </button>
);

export const RoadmapDiagram = ({
  lessons,
  groups,
  branches,
  doneSlugs,
  nextSlug,
  onToggle,
}: {
  lessons: SanityLearningLesson[];
  groups: SanityLearningGroup[];
  branches: SanityLearningBranch[];
  doneSlugs: Set<string>;
  nextSlug: string | null;
  onToggle: (slug: string) => void;
}) => {
  const items = buildDiagramItems(lessons, groups, branches);
  if (items.length === 0) return null;
  const { rows, totalH, spineEndX } = layoutRows(items);
  const flagY = totalH - 10;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative" style={{ width: BOARD_W, height: totalH }}>
        <svg
          width={BOARD_W}
          height={totalH}
          className="absolute inset-0"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="rdm-arr"
              markerWidth="9"
              markerHeight="9"
              refX="7"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L8,3.5 L0,7 Z" fill="#2563eb" />
            </marker>
            <marker
              id="rdm-arr-gray"
              markerWidth="9"
              markerHeight="9"
              refX="7"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L8,3.5 L0,7 Z" fill="#94a3b8" />
            </marker>
          </defs>
          <path
            d={spinePath(rows)}
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {rows.map((row, i) => {
            const dashed = row.item.type === "branch";
            const bow = BOWS[i % BOWS.length];
            const dx = row.edgeX - row.spineX;
            const d = `M ${row.spineX},${row.centerY} C ${row.spineX + dx * 0.35},${row.centerY + bow} ${row.spineX + dx * 0.65},${row.centerY - bow} ${row.edgeX},${row.centerY}`;
            return (
              <path
                key={`curve-${i}`}
                d={d}
                stroke={dashed ? "#94a3b8" : "#2563eb"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={dashed ? "8 6" : undefined}
                markerEnd={dashed ? "url(#rdm-arr-gray)" : "url(#rdm-arr)"}
              />
            );
          })}
          {/* Hub di baris pertama + baris tempat stack menempel */}
          {rows.map((row, i) =>
            i === 0 || row.item.type !== "lesson" ? (
              <circle
                key={`hub-${i}`}
                cx={row.spineX}
                cy={row.centerY}
                r="9"
                fill="#2563eb"
              />
            ) : null
          )}
          {/* Bendera selesai di ujung spine */}
          <line
            x1={spineEndX}
            y1={flagY - 42}
            x2={spineEndX}
            y2={flagY}
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon
            points={`${spineEndX},${flagY - 42} ${spineEndX + 32},${flagY - 33} ${spineEndX},${flagY - 24}`}
            fill="#2563eb"
          />
          <text
            x={spineEndX + 42}
            y={flagY - 26}
            fontSize="14"
            fontWeight="700"
            fill="#2563eb"
          >
            Jalur Selesai
          </text>
        </svg>

        {/* Legenda */}
        <div className="absolute right-0 top-0 w-[290px] border-2 border-gray-900 dark:border-gray-100 rounded bg-white dark:bg-gray-800 p-3">
          <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
            Legenda
          </p>
          <div className="flex flex-col gap-1.5 text-[13px] text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-[52px] h-5 shrink-0 border-2 border-gray-900 dark:border-gray-100 rounded-sm bg-[#fde047]" />
              Materi berikutnya
            </span>
            <span className="flex items-center gap-2">
              <span className="w-[52px] h-5 shrink-0 border-2 border-gray-900 dark:border-gray-100 rounded-sm bg-[#f6d492]" />
              Materi utama
            </span>
            <span className="flex items-center gap-2">
              <span className="w-[52px] h-5 shrink-0 border-2 border-gray-900 dark:border-gray-100 rounded-sm bg-gray-200 dark:bg-gray-600" />
              Cabang opsional
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Border hijau + centang = sudah selesai. Klik judul membuka
            artikelnya; tombol lingkaran menandai selesai.
          </p>
        </div>

        {rows.map((row, i) => {
          const { item } = row;
          if (item.type === "lesson") {
            const { lesson, index } = item;
            const done = doneSlugs.has(lesson.slug);
            const isNext = nextSlug === lesson.slug;
            return (
              <div
                key={lesson.slug}
                id={`halte-${lesson.slug}`}
                className="absolute scroll-mt-36"
                style={{ left: row.x, top: row.top, width: row.width }}
              >
                <div
                  className={`relative rounded border-2 px-3 py-2.5 ${
                    isNext
                      ? "bg-[#fde047] border-gray-900 dark:border-gray-100 shadow-[0_0_0_5px] shadow-amber-200/60 dark:shadow-amber-900/30"
                      : done
                        ? "bg-[#f6d492] border-green-600"
                        : "bg-[#f6d492] border-gray-900 dark:border-gray-100"
                  }`}
                >
                  {isNext && (
                    <span className="absolute -top-3 left-3 text-[10px] font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">
                      MATERI BERIKUTNYA
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                        done
                          ? "bg-green-600 text-white"
                          : "border-2 border-gray-900/40 text-gray-700"
                      }`}
                    >
                      {done ? <FaCheck className="text-[10px]" /> : index + 1}
                    </span>
                    {lesson.readTime && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-600">
                        <FaClock />
                        {lesson.readTime}
                      </span>
                    )}
                    <span className="flex-1" />
                    <SmallToggle
                      done={done}
                      title={lesson.title}
                      onToggle={() => onToggle(lesson.slug)}
                    />
                  </div>
                  <Link
                    href={`/blogs/${lesson.slug}`}
                    className={`block font-semibold text-[13px] leading-snug mt-1.5 line-clamp-2 hover:text-blue-700 transition-colors ${
                      done ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {lesson.title}
                  </Link>
                </div>
              </div>
            );
          }

          const isBranch = item.type === "branch";
          const stack = isBranch ? item.branch : item.group;
          const stackLessons = stack.lessons ?? [];
          return (
            <div
              key={`${isBranch ? "cabang" : "grup"}-${stack._key}`}
              id={`${isBranch ? "cabang" : "grup"}-${stack._key}`}
              className="absolute scroll-mt-36"
              style={{ left: row.x, top: row.top, width: row.width }}
            >
              <div
                className={`rounded border-2 overflow-hidden ${
                  isBranch
                    ? "border-dashed border-gray-400 dark:border-gray-500 bg-gray-100/70 dark:bg-gray-800/60"
                    : "border-gray-900 dark:border-gray-100 bg-[#f6d492]/50"
                }`}
              >
                <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
                  {isBranch ? (
                    <FaCodeBranch className="text-gray-400 text-xs shrink-0" />
                  ) : (
                    <FaLayerGroup className="text-gray-600 text-xs shrink-0" />
                  )}
                  <span className="font-bold text-[13px] text-gray-900 dark:text-gray-100 truncate">
                    {isBranch ? `Cabang: ${stack.label}` : `Grup: ${stack.label}`}
                  </span>
                  {isBranch && (
                    <span className="shrink-0 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Opsional
                    </span>
                  )}
                </div>
                <div
                  className={`divide-y-2 ${
                    isBranch
                      ? "divide-gray-300 dark:divide-gray-700"
                      : "divide-gray-900/20 dark:divide-white/20"
                  }`}
                >
                  {stackLessons.map((lesson, li) => {
                    const done = doneSlugs.has(lesson.slug);
                    const isNext = nextSlug === lesson.slug;
                    return (
                      <div key={lesson.slug} className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              done
                                ? "bg-green-600 text-white"
                                : isNext
                                  ? "bg-amber-500 text-white"
                                  : "border-2 border-gray-400 text-gray-500"
                            }`}
                          >
                            {done ? (
                              <FaCheck className="text-[8px]" />
                            ) : (
                              li + 1
                            )}
                          </span>
                          {lesson.readTime && (
                            <span className="text-[11px] text-gray-500">
                              {lesson.readTime}
                            </span>
                          )}
                          <span className="flex-1" />
                          <SmallToggle
                            done={done}
                            title={lesson.title}
                            onToggle={() => onToggle(lesson.slug)}
                          />
                        </div>
                        <Link
                          href={`/blogs/${lesson.slug}`}
                          className={`block font-medium text-[13px] leading-snug mt-1 line-clamp-2 hover:text-blue-700 transition-colors ${
                            done
                              ? "text-gray-500 dark:text-gray-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {lesson.title}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
