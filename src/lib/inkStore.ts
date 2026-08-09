import { INK_PAGES, InkItem } from "@/data/inkMarks";

/**
 * The ink placements InkLayer is currently drawing.
 *
 * In production this is INK_PAGES and nothing ever writes to it — the store is
 * one module-level reference and a Set of listeners, so the cost is a single
 * useSyncExternalStore subscription that never fires.
 *
 * In dev the ink editor swaps the whole record on every drag, which is what
 * makes the page itself the preview: there is no second renderer to keep
 * honest, so what you drag is exactly what ships.
 */

export type InkPages = Record<string, InkItem[]>;

let pages: InkPages = INK_PAGES;
const listeners = new Set<() => void>();

export const subscribeInkPages = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** Stable identity while nothing edits, so InkLayer's effect doesn't re-run. */
export const getInkPages = (): InkPages => pages;

export const setInkPages = (next: InkPages) => {
  pages = next;
  for (const fn of listeners) fn();
};

export const resetInkPages = () => setInkPages(INK_PAGES);

/** True once the editor has changed anything away from the committed data. */
export const inkPagesDirty = () => pages !== INK_PAGES;
