"use client";
import Header from "@/app/components/Fragements/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaCheck, FaClock, FaCodeBranch, FaListUl } from "react-icons/fa";

import type { SanityLearningPath } from "@/sanity/lib/queries";
import {
  formatTotalMinutes,
  parseReadMinutes,
  readLearnProgress,
  type LearnProgress,
} from "@/app/utils/learn-progress";

const PathCard = ({
  path,
  index,
  progress,
  mounted,
}: {
  path: SanityLearningPath;
  index: number;
  progress: LearnProgress;
  mounted: boolean;
}) => {
  const mainLessons = path.lessons ?? [];
  const branchLessons = (path.branches ?? []).flatMap((b) => b.lessons ?? []);
  const totalMinutes = mainLessons.reduce(
    (sum, lesson) => sum + parseReadMinutes(lesson.readTime),
    0
  );
  const doneSlugs = new Set(progress[path.slug] ?? []);
  const doneCount = [...mainLessons, ...branchLessons].filter((l) =>
    doneSlugs.has(l.slug)
  ).length;
  const total = mainLessons.length + branchLessons.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const isDone = mounted && total > 0 && doneCount === total;

  return (
    <Link
      href={`/learn/${path.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl font-bold text-blue-600/15 dark:text-blue-400/20 leading-none select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
            {path.level}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {path.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 line-clamp-3">
          {path.description}
        </p>
        <div className="mt-auto">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1.5">
              <FaListUl className="text-blue-500" />
              {total} materi
            </span>
            {totalMinutes > 0 && (
              <span className="flex items-center gap-1.5">
                <FaClock className="text-blue-500" />
                {formatTotalMinutes(totalMinutes)}
              </span>
            )}
          </div>
          {mounted && total > 0 && (
            <div className="mb-4">
              {/* Mini-map: satu titik per materi, terisi = selesai.
                  Titik kecil berdering = materi cabang (opsional). */}
              <div
                className="flex items-center gap-1.5 flex-wrap mb-3"
                aria-hidden="true"
              >
                {mainLessons.map((l) => (
                  <span
                    key={l.slug}
                    className={`w-2.5 h-2.5 rounded-full ${
                      doneSlugs.has(l.slug)
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  />
                ))}
                {branchLessons.length > 0 && (
                  <>
                    <FaCodeBranch className="text-[10px] text-gray-400 dark:text-gray-500 ml-1.5" />
                    {branchLessons.map((l) => (
                      <span
                        key={l.slug}
                        className={`w-2 h-2 rounded-full ${
                          doneSlugs.has(l.slug)
                            ? "bg-amber-500"
                            : "border border-amber-400 dark:border-amber-500"
                        }`}
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                {isDone ? (
                  <>
                    <FaCheck className="text-green-600 dark:text-green-400" />
                    Jalur selesai — kerja bagus!
                  </>
                ) : (
                  `${doneCount}/${total} materi selesai`
                )}
              </p>
            </div>
          )}
          <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all duration-200">
            Lihat Jalur
            <FaArrowRight className="text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export const LearnView = ({ paths }: { paths: SanityLearningPath[] }) => {
  const [progress, setProgress] = useState<LearnProgress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(readLearnProgress());
    setMounted(true);
  }, []);

  const totalLessons = paths.reduce(
    (sum, p) =>
      sum +
      (p.lessons?.length ?? 0) +
      (p.branches ?? []).reduce((s, b) => s + (b.lessons?.length ?? 0), 0),
    0
  );

  return (
    <div className="w-full min-h-screen pt-28 px-6 md:px-0">
      <Header
        title="Learn"
        description="Belajar web development tanpa menebak urutan. Pilih satu jalur, lalu ikuti materinya langkah demi langkah — dari fondasi sampai mahir. Tandai materi yang sudah selesai dan lanjutkan kapan pun."
      />
      <hr className="border-1.5 border-black dark:border-white mt-8 mb-12" />

      {paths.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {paths.length} jalur belajar &bull; {totalLessons} materi
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {paths.map((path, i) => (
              <PathCard
                key={path._id}
                path={path}
                index={i}
                progress={progress}
                mounted={mounted}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl mb-16">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Jalur belajar sedang disiapkan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Materi pertama segera hadir di sini. Sementara itu, kamu bisa
            menjelajahi semua artikel lewat halaman{" "}
            <Link href="/blogs" className="text-blue-600 dark:text-blue-400 font-medium">
              Blogs
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
};
