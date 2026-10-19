export type ChapterId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'soft-skills'
  | 'experience'
  | 'projects'
  | 'contact'
  | 'outro';

/** Snap sequence through the content chapters (no video clock). */
export const chapterOrder: ChapterId[] = ['hero', 'skills', 'soft-skills', 'experience'];

/** Index of the projects section (first post-content snap). */
export const SNAP_PROJECTS_INDEX = chapterOrder.length;

/** Index of the contact section (last snap step). */
export const SNAP_CONTACT_INDEX = chapterOrder.length + 1;

export const SNAP_STEP_COUNT = SNAP_CONTACT_INDEX + 1;

export function chapterFocusStep(id: ChapterId): number {
  if (id === 'projects') return SNAP_PROJECTS_INDEX;
  if (id === 'contact' || id === 'outro') return SNAP_CONTACT_INDEX;
  const index = chapterOrder.indexOf(id);
  return index >= 0 ? index : 0;
}

export function snapIndexForChapter(id: ChapterId): number {
  return chapterFocusStep(id);
}

/** Discrete step index used as scroll “time” (0 … SNAP_STEP_COUNT-1). */
export function snapTimeForIndex(index: number): number {
  return Math.max(0, Math.min(SNAP_STEP_COUNT - 1, index));
}

export function chapterAt(step: number): ChapterId | null {
  const index = Math.round(step);
  if (index < 0 || index >= chapterOrder.length) return null;
  return chapterOrder[index] ?? null;
}

export function isChapterStep(step: number, id: ChapterId): boolean {
  return Math.round(step) === chapterFocusStep(id);
}
