"use client";
import Header from "@/app/components/Fragements/Header";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaListUl,
  FaTag,
} from "react-icons/fa";

import type { SanityLearningPath } from "@/sanity/lib/queries";
import {
  formatTotalMinutes,
  parseReadMinutes,
  readLearnProgress,
  toggleLessonDone,
  writeLearnProgress,
  type LearnProgress,
} from "@/app/utils/learn-progress";

export const LearnDetailView = ({ path }: { path: SanityLearningPath }) => {
  const [progress, setProgress] = useState<LearnProgress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(readLearnProgress());
    setMounted(true);
  }, []);

  const lessons = path.lessons ?? [];
  const doneSlugs = new Set(progress[path.slug] ?? []);
  const doneCount = lessons.filter((l) => doneSlugs.has(l.slug)).length;
  const total = lessons.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const allDone = total > 0 && doneCount === total;
  const nextLesson = lessons.find((l) => !doneSlugs.has(l.slug));
  const totalMinutes = lessons.reduce(
    (sum, l) => sum + parseReadMinutes(l.readTime),
    0
  );

  const handleToggle = (lessonSlug: string) => {
    setProgress((prev) => {
      const next = toggleLessonDone(prev, path.slug, lessonSlug);
      writeLearnProgress(next);
      return next;
    });
  };

  return (
    <div className="w-full min-h-screen pt-28 px-6 md:px-0">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
      >
        <FaArrowLeft className="text-xs" />
        Semua Jalur Belajar
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
          {path.level}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <FaListUl className="text-blue-500" />
          {total} materi
        </span>
        {totalMinutes > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <FaClock className="text-blue-500" />
            {formatTotalMinutes(totalMinutes)}
          </span>
        )}
      </div>

      <Header title={path.title} description={path.description ?? ""} />

      <div className="mt-8 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {mounted && total > 0 && !allDone && nextLesson && (
          <Link
            href={`/blogs/${nextLesson.slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm w-full sm:w-auto"
          >
            {doneCount === 0 ? "Mulai Belajar" : "Lanjut Belajar"}
            <FaArrowRight className="text-xs" />
          </Link>
        )}
        {mounted && allDone && (
          <p className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg font-medium w-full sm:w-auto justify-center">
            <FaCheck />
            Kamu sudah menyelesaikan jalur ini
          </p>
        )}
        {mounted && total > 0 && (
          <div className="flex-1 w-full">
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {doneCount}/{total} materi selesai ({percent}%)
            </p>
          </div>
        )}
      </div>

      <hr className="border-1.5 border-black dark:border-white mt-8 mb-10" />

      {total > 0 ? (
        <ol className="flex flex-col gap-4 mb-8">
          {lessons.map((lesson, i) => {
            const done = doneSlugs.has(lesson.slug);
            return (
              <li
                key={lesson.slug}
                className={`flex items-stretch gap-4 bg-white dark:bg-gray-800 border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
                  done
                    ? "border-green-200 dark:border-green-900"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <span
                  className={`text-2xl font-bold leading-none select-none w-10 shrink-0 text-center pt-1 ${
                    done
                      ? "text-green-500/60 dark:text-green-400/50"
                      : "text-blue-600/25 dark:text-blue-400/25"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {lesson.coverUrl && (
                  <div className="relative w-24 h-16 shrink-0 hidden sm:block overflow-hidden rounded-lg">
                    <Image
                      src={lesson.coverUrl}
                      alt={lesson.coverAlt || lesson.title || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
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
                <button
                  type="button"
                  onClick={() => handleToggle(lesson.slug)}
                  aria-pressed={done}
                  aria-label={
                    done
                      ? `Tandai "${lesson.title}" belum selesai`
                      : `Tandai "${lesson.title}" selesai`
                  }
                  title={done ? "Tandai belum selesai" : "Tandai selesai"}
                  className={`shrink-0 self-center w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    done
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 dark:border-gray-600 text-transparent hover:border-blue-500 hover:text-blue-200"
                  }`}
                >
                  <FaCheck className="text-sm" />
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Jalur ini belum memiliki materi.
        </p>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-16">
        Progresmu tersimpan otomatis di browser ini — tidak perlu akun. Klik
        lingkaran di kanan materi untuk menandai selesai.
      </p>
    </div>
  );
};
