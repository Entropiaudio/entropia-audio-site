import { useSyncExternalStore } from "react";

/**
 * Which skin the plugin screenshots show: every plugin ships a Night and a
 * Daylight skin, and the product plates carry both. One choice, site-wide —
 * flip it on Chaosverb's page and Entropan's opens the same way.
 *
 * First visit: the visitor's OS theme picks (dark → night), so the plate
 * matches the screen they're reading on. Once they flip the switch the choice
 * is remembered in this browser. Storage is a convenience only — a private
 * window or blocked site data just means the OS theme decides each visit.
 */
export type PluginSkin = "night" | "daylight";

export const PLUGIN_SKINS: readonly PluginSkin[] = ["night", "daylight"];

const STORAGE_KEY = "entropia.plugin-skin";

const isSkin = (v: unknown): v is PluginSkin => v === "night" || v === "daylight";

const initialSkin = (): PluginSkin => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isSkin(saved)) return saved;
  } catch {
    /* storage blocked — fall through to the OS theme */
  }
  try {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "night";
  } catch {
    /* no matchMedia — daylight, the site's own register */
  }
  return "daylight";
};

let current: PluginSkin | null = null;
const listeners = new Set<() => void>();

export const getPluginSkin = (): PluginSkin => (current ??= initialSkin());

export const setPluginSkin = (skin: PluginSkin) => {
  if (skin === getPluginSkin()) return;
  current = skin;
  try {
    window.localStorage.setItem(STORAGE_KEY, skin);
  } catch {
    /* not remembered, still applied */
  }
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The current skin and its setter, shared by every plate on the page. */
export const usePluginSkin = () => {
  const skin = useSyncExternalStore(subscribe, getPluginSkin, () => "daylight" as const);
  return [skin, setPluginSkin] as const;
};

/** Test seam: forget the resolved skin so the next read starts over. */
export const resetPluginSkinForTests = () => {
  current = null;
};
