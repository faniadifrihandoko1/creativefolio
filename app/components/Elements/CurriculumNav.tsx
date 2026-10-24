"use client";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

import type { SanityPostPath } from "@/sanity/lib/queries";
import { getLessonPosition } from "@/app/utils/learn-membership";
import {
  markLessonDone,
  notifyLearnProgress,
  readLearnProgress,
  writeLearnProgress,
} from "@/app/utils/learn-progress";

/**
 * Navigasi Sebelumnya/Berikutnya mengikuti urutan kurikulum jalur
 * belajar (DEL-106) — menggantikan navigasi urut tanggal terbit untuk
 * artikel yang masuk jalur. Klik "Materi Berikutnya" ikut menandai
 * materi saat ini selesai.
 */
export const CurriculumNav = ({
  path,
  postSlug,
}: {
  path: SanityPostPath;
  postSlug: string;
}) => {
  const position = getLessonPosition(path, postSlug);
  if (!position) return null;
  const { prev, next, nextReturnsToMain } = position;

  const markCurrentDone = () => {
    writeLearnProgress(markLessonDone(readLearnProgress(), path.slug, postSlug));
    notifyLearnProgress();
  };

  const cardClass =
    "group block border rounded-xl p-4 sm:p-5 bg-white dark:bg-gray-800 transition-colors duration-200";

  return (
    <nav
      aria-label="Navigasi kurikulum"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16"
    >
      {prev ? (
        <Link
          href={`/blogs/${prev.slug}`}
          className={`${cardClass} border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700`}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <FaArrowLeft className="text-[9px]" />
            Materi Sebelumnya
          </span>
          <span className="block mt-1.5 font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blogs/${next.slug}`}
          onClick={markCurrentDone}
          className={`${cardClass} border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 sm:text-right`}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:justify-end">
            {nextReturnsToMain ? "Lanjut ke Rute Utama" : "Materi Berikutnya"}
            <FaArrowRight className="text-[9px]" />
          </span>
          <span className="block mt-1.5 font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <Link
          href={`/learn/${path.slug}`}
          className={`${cardClass} border-green-200 dark:border-green-900 bg-green-50/60 dark:bg-green-900/10 hover:border-green-300 dark:hover:border-green-700 sm:text-right`}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 sm:justify-end">
            <FaCheck className="text-[9px]" />
            Akhir Jalur
          </span>
          <span className="block mt-1.5 font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 line-clamp-2">
            Materi terakhir di {path.title} — lihat peta jalurnya
          </span>
        </Link>
      )}
    </nav>
  );
};
