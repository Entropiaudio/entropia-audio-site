import { useEffect } from "react";
import { copy } from "@/copy";

type TitleKey = Exclude<keyof typeof copy.tabTitles, "suffix">;

/**
 * Sets the browser tab title for one route, from a key in copy.tabTitles.
 *
 * index.html carries the title the site ships with — that's what a crawler
 * without JS sees, and it stays the homepage's. Every other route overwrites
 * it on mount and hands it back on unmount, so navigating back to `/` restores
 * the original instead of keeping the last product's name.
 *
 * Takes a key rather than a string so every tab title stays in copy.ts, where
 * someone who doesn't write TypeScript can edit it.
 */
export const usePageTitle = (key?: TitleKey) => {
  useEffect(() => {
    const name = key && copy.tabTitles[key];
    if (!name) return;
    const previous = document.title;
    document.title = `${name}${copy.tabTitles.suffix}`;
    return () => {
      document.title = previous;
    };
  }, [key]);
};

export default usePageTitle;
