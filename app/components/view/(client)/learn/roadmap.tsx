"use client";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaClock, FaCodeBranch, FaTag } from "react-icons/fa";

import type {
  SanityLearningBranch,
  SanityLearningLesson,
} from "@/sanity/lib/queries";

/**
 * Peta roadmap jalur belajar (DEL-105): rute utama digambar sebagai
 * garis perjalanan dengan halte bernomor — desktop halte bergantian
 * kiri/kanan dari garis tengah, mobile satu garis di kiri. Segmen garis
 * setelah halte yang selesai ikut terisi warna. Cabang (materi opsional)
 * tampil sebagai panel rute samping yang menempel pada halte jangkarnya.
 */

type RoadmapItem =
  | { type: "lesson"; lesson: SanityLearningLesson; index: number }
  | { type: "branch"; branch: SanityLearningBranch; anchorIndex: number };

const ToggleButton = ({
  done,
  title,
  onToggle,
  small = false,
}: {
  done: boolean;
  title?: string;
  onToggle: () => void;
  small?: boolean;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={done}
    aria-label={
      done ? `Tandai "${title}" belum selesai` : `Tandai "${title}" selesai`
    }
    title={done ? "Tandai belum selesai" : "Tandai selesai"}
    className={`shrink-0 self-center ${
      small ? "w-8 h-8" : "w-10 h-10"
    } rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
      done
        ? "bg-green-600 border-green-600 text-white"
        : "border-gray-300 dark:border-gray-600 text-transparent hover:border-blue-500 hover:text-blue-200"
    }`}
  >
    <FaCheck className={small ? "text-[10px]" : "text-sm"} />
  </button>
);

const LessonCard = ({
  lesson,
  done,
  isNext,
  onToggle,
}: {
  lesson: SanityLearningLesson;
  done: boolean;
  isNext: boolean;
  onToggle: (slug: string) => void;
}) => (
  <div
    className={`flex items-stretch gap-4 bg-white dark:bg-gray-800 border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
      isNext
        ? "border-blue-400 dark:border-blue-600 shadow-md"
        : done
          ? "border-green-200 dark:border-green-900"
          : "border-gray-200 dark:border-gray-700"
    }`}
  >
    {lesson.coverUrl && (
      <div className="relative w-24 h-16 shrink-0 hidden sm:block overflow-hidden rounded-lg self-center">
        <Image
          src={lesson.coverUrl}
          alt={lesson.coverAlt || lesson.title || ""}
          fill
          className="object-cover"
        />
      </div>
    )}
    <div className="flex-1 min-w-0">
      {isNext && (
        <span className="inline-block bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2">
          Materi Berikutnya
        </span>
      )}
      <Link
        href={`/blogs/${lesson.slug}`}
        className={`font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2 ${
          done
            ? "text-gray-500 dark:text-gray-400"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {lesson.title}
      </Link>
      {lesson.excerpt && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
          {lesson.excerpt}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
        {lesson.category && (
          <span className="flex items-center gap-1.5">
            <FaTag className="text-blue-500" />
            {lesson.category}
          </span>
        )}
        {lesson.readTime && (
          <span className="flex items-center gap-1.5">
            <FaClock />
            {lesson.readTime}
          </span>
        )}
      </div>
    </div>
    <ToggleButton
      done={done}
      title={lesson.title}
      onToggle={() => onToggle(lesson.slug)}
    />
  </div>
);

const BranchPanel = ({
  branch,
  doneSlugs,
  onToggle,
}: {
  branch: SanityLearningBranch;
  doneSlugs: Set<string>;
  onToggle: (slug: string) => void;
}) => (
  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 sm:p-5 bg-gray-50/60 dark:bg-gray-800/40">
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <FaCodeBranch className="text-blue-500" />
      <h3 className="font-bold text-gray-900 dark:text-gray-100">
        Cabang: {branch.label}
      </h3>
      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
        Opsional
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {branch.lessons.length} materi pendalaman
      </span>
    </div>
    <div className="flex flex-col gap-3">
      {branch.lessons.map((lesson, i) => {
        const done = doneSlugs.has(lesson.slug);
        return (
          <div key={lesson.slug} className="flex items-start gap-3">
            <span
              className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center text-[11px] font-bold ${
                done
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-400 bg-white dark:bg-gray-800"
              }`}
            >
              {done ? <FaCheck className="text-[9px]" /> : i + 1}
            </span>
            <div className="flex-1 min-w-0 pt-0.5">
              <Link
                href={`/blogs/${lesson.slug}`}
                className={`font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2 ${
                  done
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {lesson.title}
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                {lesson.category && (
                  <span className="flex items-center gap-1.5">
                    <FaTag className="text-blue-500" />
                    {lesson.category}
                  </span>
                )}
                {lesson.readTime && (
                  <span className="flex items-center gap-1.5">
                    <FaClock />
                    {lesson.readTime}
                  </span>
                )}
              </div>
            </div>
            <ToggleButton
              done={done}
              title={lesson.title}
              onToggle={() => onToggle(lesson.slug)}
              small
            />
          </div>
        );
      })}
    </div>
  </div>
);

export const RoadmapPath = ({
  lessons,
  branches,
  doneSlugs,
  nextSlug,
  onToggle,
}: {
  lessons: SanityLearningLesson[];
  branches: SanityLearningBranch[];
  doneSlugs: Set<string>;
  nextSlug: string | null;
  onToggle: (slug: string) => void;
}) => {
  // Susun urutan tampil: halte utama, disisipi panel cabang tepat
  // setelah halte jangkarnya.
  const items: RoadmapItem[] = [];
  lessons.forEach((lesson, index) => {
    items.push({ type: "lesson", lesson, index });
    branches
      .filter((b) => b.afterSlug === lesson.slug)
      .forEach((branch) => items.push({ type: "branch", branch, anchorIndex: index }));
  });
  // Cabang yang jangkarnya tidak ditemukan tetap ditampilkan di akhir.
  const placed = new Set(
    items.filter((i) => i.type === "branch").map((i) => (i as { branch: SanityLearningBranch }).branch._key)
  );
  branches
    .filter((b) => !placed.has(b._key))
    .forEach((branch) => items.push({ type: "branch", branch, anchorIndex: -1 }));

  return (
    <div>
      {items.map((item, pos) => {
        const isLast = pos === items.length - 1;
        if (item.type === "lesson") {
          const { lesson, index } = item;
          const done = doneSlugs.has(lesson.slug);
          const isNext = nextSlug === lesson.slug;
          const sideLeft = index % 2 === 0;
          return (
            <div
              key={lesson.slug}
              className="relative grid grid-cols-[44px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] items-start pb-8 last:pb-0"
            >
              {/* Sel halte (garis + lingkaran) */}
              <div className="relative col-start-1 row-start-1 md:col-start-2 flex justify-center self-stretch">
                {!isLast && (
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 top-10 md:top-12 bottom-[-2rem] w-[3px] rounded-full ${
                      done
                        ? "bg-green-500/60"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm md:text-base ${
                    done
                      ? "bg-green-600 border-green-600 text-white"
                      : isNext
                        ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_0_6px] shadow-blue-100 dark:shadow-blue-900/40"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                  }`}
                >
                  {done ? <FaCheck /> : index + 1}
                </span>
              </div>
              {/* Kartu materi */}
              <div
                className={`col-start-2 row-start-1 md:row-start-1 ${
                  sideLeft ? "md:col-start-1" : "md:col-start-3"
                }`}
              >
                <LessonCard
                  lesson={lesson}
                  done={done}
                  isNext={isNext}
                  onToggle={onToggle}
                />
              </div>
            </div>
          );
        }
        // Panel cabang
        const anchorDone =
          item.anchorIndex >= 0
            ? doneSlugs.has(lessons[item.anchorIndex].slug)
            : false;
        const anchorLeft = item.anchorIndex >= 0 && item.anchorIndex % 2 === 0;
        return (
          <div
            key={`branch-${item.branch._key}`}
            className="relative grid grid-cols-[44px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] items-start pb-8 last:pb-0"
          >
            <div className="relative col-start-1 row-start-1 md:col-start-2 flex justify-center self-stretch">
              {!isLast && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 top-8 bottom-[-2rem] w-[3px] rounded-full ${
                    anchorDone
                      ? "bg-green-500/60"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
              <span className="relative z-10 w-8 h-8 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-400 flex items-center justify-center text-xs">
                <FaCodeBranch />
              </span>
            </div>
            <div
              className={`col-start-2 row-start-1 md:row-start-1 ${
                anchorLeft ? "md:col-start-1" : "md:col-start-3"
              }`}
            >
              <BranchPanel
                branch={item.branch}
                doneSlugs={doneSlugs}
                onToggle={onToggle}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
