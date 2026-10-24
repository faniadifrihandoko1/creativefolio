/**
 * Progres belajar halaman /learn — disimpan lokal di browser pengunjung
 * (localStorage), tanpa akun dan tanpa server. Bentuk data:
 * { [slugJalur: string]: string[] }  // daftar slug materi yang ditandai selesai
 */
export const LEARN_PROGRESS_KEY = "learn-progress-v1";

export type LearnProgress = Record<string, string[]>;

export function readLearnProgress(): LearnProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LEARN_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const clean: LearnProgress = {};
    for (const [path, lessons] of Object.entries(
      parsed as Record<string, unknown>
    )) {
      if (Array.isArray(lessons)) {
        clean[path] = lessons.filter(
          (s): s is string => typeof s === "string"
        );
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function writeLearnProgress(progress: LearnProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // localStorage penuh/diblokir — progres sesi ini saja yang hilang.
  }
}

/** Salinan progres baru dengan status selesai satu materi dibalik. */
export function toggleLessonDone(
  progress: LearnProgress,
  pathSlug: string,
  lessonSlug: string
): LearnProgress {
  const current = new Set(progress[pathSlug] ?? []);
  if (current.has(lessonSlug)) {
    current.delete(lessonSlug);
  } else {
    current.add(lessonSlug);
  }
  return { ...progress, [pathSlug]: Array.from(current) };
}

/** Salinan progres baru dengan satu materi ditandai selesai (tanpa membalik). */
export function markLessonDone(
  progress: LearnProgress,
  pathSlug: string,
  lessonSlug: string
): LearnProgress {
  const current = new Set(progress[pathSlug] ?? []);
  if (current.has(lessonSlug)) return progress;
  current.add(lessonSlug);
  return { ...progress, [pathSlug]: Array.from(current) };
}

/** Event window yang disiarkan setiap progres berubah (sinkronisasi antar komponen dalam satu tab). */
export const LEARN_PROGRESS_EVENT = "learn-progress-changed";

export function notifyLearnProgress() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LEARN_PROGRESS_EVENT));
}

/** "5 menit" -> 5; string tanpa angka -> 0. */
export function parseReadMinutes(readTime?: string | null): number {
  if (!readTime) return 0;
  const match = readTime.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/** 45 -> "±45 menit"; 95 -> "±1 jam 35 menit"; 120 -> "±2 jam". */
export function formatTotalMinutes(total: number): string {
  if (total <= 0) return "";
  if (total < 60) return `±${total} menit`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest > 0 ? `±${hours} jam ${rest} menit` : `±${hours} jam`;
}
