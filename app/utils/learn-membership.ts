import type {
  SanityPathLessonRef,
  SanityPostPath,
} from "@/sanity/lib/queries";

/**
 * Posisi satu artikel di dalam jalur belajarnya + tetangga kurikulumnya.
 * Dipakai strip jalur dan navigasi Sebelumnya/Berikutnya di halaman artikel.
 *
 * Aturan navigasi:
 * - Materi utama: sebelum/berikutnya mengikuti urutan rute utama.
 * - Materi cabang: sebelumnya = materi cabang sebelumnya, atau halte
 *   jangkarnya bila ia yang pertama; berikutnya = materi cabang berikutnya,
 *   atau materi utama setelah halte jangkar bila ia yang terakhir.
 */
export interface LessonPosition {
  kind: "main" | "branch";
  /** Indeks 0-based di rute utama, atau di dalam cabangnya. */
  index: number;
  /** Label cabang (hanya untuk kind === "branch"). */
  branchLabel: string | null;
  /** Jumlah materi pada daftar yang sama (rute utama / cabang ini). */
  listTotal: number;
  /** Total seluruh materi jalur (utama + semua cabang). */
  pathTotal: number;
  prev: SanityPathLessonRef | null;
  next: SanityPathLessonRef | null;
  /** True bila "next" melompat dari cabang kembali ke rute utama. */
  nextReturnsToMain: boolean;
  /** Cabang yang menempel tepat setelah artikel ini (bila ada). */
  anchoredBranchLabel: string | null;
}

export function getLessonPosition(
  path: SanityPostPath,
  postSlug: string
): LessonPosition | null {
  const main = path.lessons ?? [];
  const branches = path.branches ?? [];
  const pathTotal =
    main.length +
    branches.reduce((sum, b) => sum + (b.lessons?.length ?? 0), 0);

  const mainIndex = main.findIndex((l) => l.slug === postSlug);
  if (mainIndex >= 0) {
    const anchored = branches.find((b) => b.afterSlug === postSlug);
    return {
      kind: "main",
      index: mainIndex,
      branchLabel: null,
      listTotal: main.length,
      pathTotal,
      prev: mainIndex > 0 ? main[mainIndex - 1] : null,
      next: mainIndex < main.length - 1 ? main[mainIndex + 1] : null,
      nextReturnsToMain: false,
      anchoredBranchLabel: anchored ? anchored.label : null,
    };
  }

  for (const branch of branches) {
    const branchLessons = branch.lessons ?? [];
    const branchIndex = branchLessons.findIndex((l) => l.slug === postSlug);
    if (branchIndex < 0) continue;
    const anchorIndex = main.findIndex((l) => l.slug === branch.afterSlug);
    const anchor = anchorIndex >= 0 ? main[anchorIndex] : null;
    const afterAnchor =
      anchorIndex >= 0 && anchorIndex < main.length - 1
        ? main[anchorIndex + 1]
        : null;
    const nextInBranch =
      branchIndex < branchLessons.length - 1
        ? branchLessons[branchIndex + 1]
        : null;
    return {
      kind: "branch",
      index: branchIndex,
      branchLabel: branch.label,
      listTotal: branchLessons.length,
      pathTotal,
      prev: branchIndex > 0 ? branchLessons[branchIndex - 1] : anchor,
      next: nextInBranch ?? afterAnchor,
      nextReturnsToMain: !nextInBranch && !!afterAnchor,
      anchoredBranchLabel: null,
    };
  }

  return null;
}
