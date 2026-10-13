/**
 * Which page's marks a route gets.
 *
 * Its own module so both InkLayer and the editor can read it without either
 * exporting a non-component (which costs the file its fast refresh — and the
 * whole point of the editor is a tight edit loop).
 */

const PAGE_FOR: ReadonlyArray<[RegExp, string]> = [
  [/^\/$/, "entropia-website"],
  [/^\/about\/?$/, "about"],
  [/^\/plugins\/chaosverb\/?$/, "chaosverb"],
  [/^\/plugins\/fiction\/?$/, "fiction"],
  [/^\/plugins\/entropan\/?$/, "entropan"],
  [/^\/checkout\/?$/, "checkout"],
  [/^\/activate\/?$/, "activate"],
  [/^\/order\/[^/]+\/?$/, "ordersuccess"],
];

/** Pages that stay clean. Cart, account and legal are deliberately bare —
 *  someone is doing a task or reading terms, so the paper keeps out of it.
 *  Plugin pages other than the three above have no marks placed yet. Everything
 *  else falls through to the 404 page and gets its two. */
const NO_INK = [/^\/cart\/?$/, /^\/account\/?$/, /^\/legal(\/|$)/, /^\/plugins\/[^/]+\/?$/];

export const inkPageKey = (path: string): string | null => {
  for (const [re, key] of PAGE_FOR) if (re.test(path)) return key;
  for (const re of NO_INK) if (re.test(path)) return null;
  return "notfound";
};
