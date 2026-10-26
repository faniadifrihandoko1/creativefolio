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
 * - Materi cabang/grup: sebelumnya = materi klaster sebelumnya, atau halte
 *   jangkarnya bila ia yang pertama; berikutnya = materi klaster berikutnya,
 *   atau materi utama setelah halte jangkar bila ia yang terakhir.
 *   (Grup memakai aturan yang sama dengan cabang; bedanya hanya tampilan
 *   di peta: grup berkonektor solid karena bagian rute utama, cabang
 *   putus-putus karena opsional.)
 */
export interface LessonPosition {
  kind: "main" | "branch" | "group";
  /** Indeks 0-based di rute utama, atau di dalam klaster ini. */
  index: number;
  /** Label cabang (hanya untuk kind === "branch"). */
  branchLabel: string | null;
  /** Label grup (hanya untuk kind === "group"). */
  groupLabel: string | null;
  /** Jumlah materi pada daftar yang sama (rute utama / klaster ini). */
  listTotal: number;
  /** Total seluruh materi jalur (utama + semua cabang + semua grup). */
  pathTotal: number;
  prev: SanityPathLessonRef | null;
  next: SanityPathLessonRef | null;
  /** True bila "next" melompat dari klaster kembali ke rute utama. */
  nextReturnsToMain: boolean;
  /** Cabang yang menempel tepat setelah artikel ini (bila ada). */
  anchoredBranchLabel: string | null;
  /** Grup yang menempel tepat setelah artikel ini (bila ada). */
  anchoredGroupLabel: string | null;
}

export function getLessonPosition(
  path: SanityPostPath,
  postSlug: string
): LessonPosition | null {
  const main = path.lessons ?? [];
  const branches = path.branches ?? [];
  const groups = path.groups ?? [];
  const pathTotal =
    main.length +
    branches.reduce((sum, b) => sum + (b.lessons?.length ?? 0), 0) +
    groups.reduce((sum, g) => sum + (g.lessons?.length ?? 0), 0);

  const mainIndex = main.findIndex((l) => l.slug === postSlug);
  if (mainIndex >= 0) {
    const anchored = branches.find((b) => b.afterSlug === postSlug);
    const anchoredGroup = groups.find((g) => g.afterSlug === postSlug);
    return {
      kind: "main",
      index: mainIndex,
      branchLabel: null,
      groupLabel: null,
      listTotal: main.length,
      pathTotal,
      prev: mainIndex > 0 ? main[mainIndex - 1] : null,
      next: mainIndex < main.length - 1 ? main[mainIndex + 1] : null,
      nextReturnsToMain: false,
      anchoredBranchLabel: anchored ? anchored.label : null,
      anchoredGroupLabel: anchoredGroup ? anchoredGroup.label : null,
    };
  }

  const clusters: {
    kind: "branch" | "group";
    label: string;
    afterSlug: string | null;
    lessons: SanityPathLessonRef[];
  }[] = [
    ...branches.map((b) => ({
      kind: "branch" as const,
      label: b.label,
      afterSlug: b.afterSlug,
      lessons: b.lessons ?? [],
    })),
    ...groups.map((g) => ({
      kind: "group" as const,
      label: g.label,
      afterSlug: g.afterSlug,
      lessons: g.lessons ?? [],
    })),
  ];

  for (const cluster of clusters) {
    const clusterLessons = cluster.lessons;
    const clusterIndex = clusterLessons.findIndex((l) => l.slug === postSlug);
    if (clusterIndex < 0) continue;
    const anchorIndex = main.findIndex((l) => l.slug === cluster.afterSlug);
    const anchor = anchorIndex >= 0 ? main[anchorIndex] : null;
    const afterAnchor =
      anchorIndex >= 0 && anchorIndex < main.length - 1
        ? main[anchorIndex + 1]
        : null;
    const nextInCluster =
      clusterIndex < clusterLessons.length - 1
        ? clusterLessons[clusterIndex + 1]
        : null;
    return {
      kind: cluster.kind,
      index: clusterIndex,
      branchLabel: cluster.kind === "branch" ? cluster.label : null,
      groupLabel: cluster.kind === "group" ? cluster.label : null,
      listTotal: clusterLessons.length,
      pathTotal,
      prev: clusterIndex > 0 ? clusterLessons[clusterIndex - 1] : anchor,
      next: nextInCluster ?? afterAnchor,
      nextReturnsToMain: !nextInCluster && !!afterAnchor,
      anchoredBranchLabel: null,
      anchoredGroupLabel: null,
    };
  }

  return null;
}
