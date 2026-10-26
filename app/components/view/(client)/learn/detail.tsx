"use client";
import Header from "@/app/components/Fragements/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaListUl,
} from "react-icons/fa";

import type { SanityLearningPath } from "@/sanity/lib/queries";
import {
  RoadmapMinimap,
  RoadmapPath,
} from "@/app/components/view/(client)/learn/roadmap";
import {
  RoadmapDiagram,
  getOrderedMainLessons,
} from "@/app/components/view/(client)/learn/roadmap-diagram";
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
  const branches = path.branches ?? [];
  const groups = path.groups ?? [];
  const branchLessons = branches.flatMap((b) => b.lessons ?? []);
  const groupLessons = groups.flatMap((g) => g.lessons ?? []);
  const allLessons = [...lessons, ...groupLessons, ...branchLessons];

  const doneSlugs = new Set(progress[path.slug] ?? []);
  const doneCount = allLessons.filter((l) => doneSlugs.has(l.slug)).length;
  const total = allLessons.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // Rute utama = materi utama + grup yang menempel (grup dilewati,
  // cabang tidak). "Berikutnya" mengikuti urutan tampil rute utama.
  const orderedMain = getOrderedMainLessons(lessons, groups);
  const mainDoneCount = orderedMain.filter((l) => doneSlugs.has(l.slug)).length;
  const allMainDone =
    orderedMain.length > 0 && mainDoneCount === orderedMain.length;
  const branchRemaining = branchLessons.filter(
    (l) => !doneSlugs.has(l.slug)
  ).length;
  const allDone = total > 0 && doneCount === total;
  const nextLesson = orderedMain.find((l) => !doneSlugs.has(l.slug));
  const totalMinutes = allLessons.reduce(
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
          {branchLessons.length > 0 &&
            ` (termasuk ${branchLessons.length} cabang)`}
          {groupLessons.length > 0 &&
            ` (termasuk ${groupLessons.length} grup)`}
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
        {mounted && total > 0 && !allMainDone && nextLesson && (
          <Link
            href={`/blogs/${nextLesson.slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm w-full sm:w-auto"
          >
            {mainDoneCount === 0 ? "Mulai Belajar" : "Lanjut Belajar"}
            <FaArrowRight className="text-xs" />
          </Link>
        )}
        {mounted && allDone && (
          <p className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg font-medium w-full sm:w-auto justify-center">
            <FaCheck />
            Kamu sudah menyelesaikan jalur ini
          </p>
        )}
        {mounted && allMainDone && !allDone && branchRemaining > 0 && (
          <p className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg font-medium w-full sm:w-auto justify-center">
            <FaCheck />
            Rute utama selesai — tinggal {branchRemaining} materi cabang
            (opsional)
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
        <div className="mb-8">
          <div className="sticky top-24 z-30 mb-6 -mx-2 px-3 py-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <RoadmapMinimap
              lessons={lessons}
              branches={branches}
              groups={groups}
              doneSlugs={doneSlugs}
              nextSlug={nextLesson?.slug ?? null}
            />
          </div>
          {/* Desktop: diagram organik gaya roadmap.sh; mobile: timeline vertikal */}
          <div className="hidden md:block">
            <RoadmapDiagram
              lessons={lessons}
              groups={groups}
              branches={branches}
              doneSlugs={doneSlugs}
              nextSlug={nextLesson?.slug ?? null}
              onToggle={handleToggle}
            />
          </div>
          <div className="md:hidden">
            <RoadmapPath
              lessons={lessons}
              branches={branches}
              groups={groups}
              doneSlugs={doneSlugs}
              nextSlug={nextLesson?.slug ?? null}
              onToggle={handleToggle}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Jalur ini belum memiliki materi.
        </p>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-16">
        Di layar lebar, peta tampil sebagai diagram bercabang: ikuti garis
        biru dari atas ke bawah, kotak kuning adalah materi berikutnya,
        kotak ber-border hijau tandanya materi selesai. Tumpukan berlabel
        Grup dilewati dalam rute utama, sedangkan panel Cabang bersifat
        opsional untuk pendalaman. Di layar kecil, peta tampil sebagai
        timeline vertikal. Progresmu tersimpan otomatis di browser ini,
        tidak perlu akun.
      </p>
    </div>
  );
};
