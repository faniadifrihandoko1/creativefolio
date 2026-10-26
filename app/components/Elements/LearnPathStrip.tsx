"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaCheck, FaRoute } from "react-icons/fa";

import type { SanityPostPath } from "@/sanity/lib/queries";
import { getLessonPosition } from "@/app/utils/learn-membership";
import {
  LEARN_PROGRESS_EVENT,
  markLessonDone,
  notifyLearnProgress,
  readLearnProgress,
  writeLearnProgress,
  type LearnProgress,
} from "@/app/utils/learn-progress";

/**
 * Strip "Bagian dari Jalur Belajar" di halaman artikel (DEL-106).
 * Menampilkan posisi artikel dalam kurikulum + progres pengunjung,
 * dan menandai materi ini selesai secara otomatis begitu pembaca
 * mencapai akhir artikel (elemen #article-end terlihat di layar).
 */
export const LearnPathStrip = ({
  path,
  postSlug,
}: {
  path: SanityPostPath;
  postSlug: string;
}) => {
  const [progress, setProgress] = useState<LearnProgress>({});
  const position = getLessonPosition(path, postSlug);

  // Baca progres + dengarkan perubahan dari komponen lain (mis. tombol
  // "Materi Berikutnya" di navigasi bawah yang ikut menandai selesai).
  useEffect(() => {
    const sync = () => setProgress(readLearnProgress());
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, []);

  // Auto-tandai selesai saat akhir artikel tercapai.
  useEffect(() => {
    if (readLearnProgress()[path.slug]?.includes(postSlug)) return;
    let observer: IntersectionObserver | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;

    const arm = () => {
      const target = document.getElementById("article-end");
      if (!target) {
        retry = setTimeout(arm, 800);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            const next = markLessonDone(readLearnProgress(), path.slug, postSlug);
            writeLearnProgress(next);
            notifyLearnProgress();
            observer?.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(target);
    };
    arm();
    return () => {
      observer?.disconnect();
      if (retry) clearTimeout(retry);
    };
  }, [path.slug, postSlug]);

  if (!position) return null;

  const doneSlugs = new Set(progress[path.slug] ?? []);
  const done = doneSlugs.has(postSlug);
  const doneCount = [
    ...(path.lessons ?? []),
    ...(path.branches ?? []).flatMap((b) => b.lessons ?? []),
    ...(path.groups ?? []).flatMap((g) => g.lessons ?? []),
  ].filter((l) => doneSlugs.has(l.slug)).length;

  return (
    <div className="mt-6 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-900/10 p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <FaRoute />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            Bagian dari Jalur Belajar
          </p>
          <Link
            href={`/learn/${path.slug}`}
            className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {path.title}
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            {position.kind === "main" ? (
              <>
                Materi {position.index + 1} dari {position.listTotal} materi
                utama
              </>
            ) : position.kind === "group" ? (
              <>
                Materi grup · {position.groupLabel} ({position.index + 1}{" "}
                dari {position.listTotal})
              </>
            ) : (
              <>
                Materi cabang · {position.branchLabel} ({position.index + 1}{" "}
                dari {position.listTotal})
              </>
            )}
            {position.anchoredBranchLabel &&
              ` · Ada cabang opsional setelah materi ini: ${position.anchoredBranchLabel}`}
            {position.anchoredGroupLabel &&
              ` · Ada grup setelah materi ini: ${position.anchoredGroupLabel}`}
          </p>
          <p className="text-sm mt-1.5 flex items-center gap-1.5">
            {done ? (
              <>
                <FaCheck className="text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Sudah ditandai selesai di jalur ini ({doneCount}/
                  {position.pathTotal})
                </span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                {doneCount}/{position.pathTotal} materi jalur selesai · materi
                ini tertandai otomatis saat kamu selesai membaca
              </span>
            )}
          </p>
        </div>
        <Link
          href={`/learn/${path.slug}`}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Lihat Peta
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
};
