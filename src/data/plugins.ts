/* ============================================================================
 * plugin product data.
 *
 * to edit the WORDS (tagline, descriptions, features, etc.) go to:
 *     src/copy.ts
 *
 * this file is for product DATA only:
 *   - slug (the URL bit, like /plugins/chaosverb)
 *   - prices
 *   - version number
 *   - audio + image file paths under /public
 * ============================================================================ */

import { copy } from "@/copy";

export type PluginDemo = {
  slug: string;
  title: string;
  caption: string;
  /** path under /public for the dry-only stem */
  drySrc?: string;
  /** path under /public for the dry + wet mix (the default mode) */
  dryWetSrc?: string;
  /** path under /public for the wet-only stem */
  wetSrc?: string;
};

/** "released" plugins are buyable; "in-development" ones only take signups. */
export type PluginStatus = "released" | "in-development";

/**
 * One image + text block on a product page. `shot` is optional: give a section
 * its own screenshot and that section shows it, leave it out and the section
 * falls back to the plugin's main screenshot. `shotSize` is optional too — the
 * frame measures the file if you don't declare it.
 */
export type PluginSection = {
  heading: string;
  body: string;
  shot?: string;
  shotSize?: { w: number; h: number };
};

export type Plugin = {
  slug: string;
  name: string;
  status: PluginStatus;
  tagline: string;
  shortDescription: string;
  /** active sale price. undefined while a plugin is still in development. */
  price?: number;
  /** crossed-out regular price; shown as "regular" when greater than price */
  regularPrice?: number;
  features: readonly string[];
  sections?: readonly PluginSection[];
  demos: PluginDemo[];
  specs?: readonly { label: string; value: string }[];
  version: string;
  /** path under /public — the plugin UI, shown big on the product page. */
  screenshot: string;
  /**
   * The screenshot's natural pixel size. PluginShot uses it to reserve the
   * frame's exact box before the image loads, so nothing jumps. If you
   * replace a screenshot, update these numbers to match the new file.
   */
  screenshotSize: { w: number; h: number };
  /** path under /public — the 3:2 art on the homepage card. */
  cardArt: string;
  /**
   * The hue that codes this plugin on cards and in its numbered lists — its
   * signature colour, sampled from the plugin's own UI. Set as *type* (card
   * tagline, status chip, numerals), so it must be the ink-grade step of the
   * product family in index.css, never the raw one.
   */
  accent: string;
  /**
   * The same signature hue as a low-alpha wash (the *-tint step). Product
   * pages stain their hero edges with it; keep it out of anything textual.
   */
  accentWash: string;
  /** Public installer URLs. Leave undefined to show a "coming soon" state. */
  downloadMacUrl?: string;
  downloadWinUrl?: string;
};

/* Fiction's story screenshots, indexed to match copy.fiction.stories. Save the
   files under public/screenshots with exactly these names. Sizes are left
   undeclared on purpose: PluginShot measures whatever you drop in, so a
   re-export of the UI needs no code change. */
const FICTION_STORY_SHOTS = [
  "/screenshots/fiction-threshold.webp",
  "/screenshots/fiction-more-than-a-gate.webp",
];

/* Entropan's story screenshots, indexed to match copy.entropan.stories: the
   STEPS modulator with a pattern drawn, then the CHAOS modulator with FLUX,
   WOW and FLUTTER pushed. Cut from the owner's v0.7.0 exports (2026-08) with
   the window's rounded-corner ring trimmed off; sizes declared so the frames
   don't reflow. */
const ENTROPAN_STORY_SHOTS = [
  { shot: "/screenshots/entropan-steps.webp", shotSize: { w: 2426, h: 1504 } },
  { shot: "/screenshots/entropan-flux.webp", shotSize: { w: 2428, h: 1358 } },
];

export const plugins: Plugin[] = [
  {
    slug: "chaosverb",
    name: copy.chaosverb.name,
    status: "released",
    tagline: copy.chaosverb.tagline,
    shortDescription: copy.chaosverb.shortDescription,
    price: 36,
    regularPrice: 50,
    features: copy.chaosverb.features,
    sections: copy.chaosverb.sections,
    demos: copy.chaosverb.demos.map((d) => ({
      slug: d.slug,
      title: d.title,
      caption: d.caption,
      drySrc: `/demos/${d.slug}-dry.wav`,
      dryWetSrc: `/demos/${d.slug}-dry-and-wet.wav`,
      wetSrc: `/demos/${d.slug}-wet.wav`,
    })),
    specs: [
      ...copy.chaosverb.specs,
      { label: "Version", value: "1.0.0" },
    ],
    version: "1.0.0",
    screenshot: "/screenshots/chaosverb.webp",
    // 2x export, re-rendered from the V1.1.1 webview UI itself (2026-08) —
    // sharp on HiDPI at the plate's 1040px render width.
    screenshotSize: { w: 2486, h: 1096 },
    cardArt: "/screenshots/chaosverb-card.webp",
    // Chaosverb's signature slate blue — the hue of its slider fills. The
    // -ink step, because the accent is set as *type* (tagline, numerals).
    accent: "var(--chaosverb-blue-ink)",
    accentWash: "var(--chaosverb-blue-tint)",
  },
  {
    slug: "fiction",
    name: copy.fiction.name,
    status: "in-development",
    tagline: copy.fiction.tagline,
    shortDescription: copy.fiction.shortDescription,
    features: copy.fiction.features,
    // one screenshot per story, in the order the stories appear in copy.ts:
    // the threshold curve being drawn for the variable-threshold block, the
    // COLOR + ARP + GRAIN DELAY panels for "much more than a gate".
    sections: copy.fiction.stories.map((s, i) => ({
      ...s,
      shot: FICTION_STORY_SHOTS[i],
    })),
    demos: [],
    specs: [
      ...copy.fiction.specs,
      { label: "Version", value: "1.42.0 · still moving" },
    ],
    version: "1.42.0",
    screenshot: "/screenshots/fiction.webp",
    // 2x asset upsampled from the 1x capture (no higher-res export exists
    // yet); replace with a true 2x export when one is available.
    screenshotSize: { w: 2600, h: 1412 },
    cardArt: "/screenshots/fiction-card.webp",
    // Fiction's signature mulberry — the hue of its spectrum wash and node
    // badges. Same ink-grade rule as Chaosverb's blue.
    accent: "var(--fiction-violet-ink)",
    accentWash: "var(--fiction-violet-tint)",
  },
  {
    slug: "entropan",
    name: copy.entropan.name,
    status: "in-development",
    tagline: copy.entropan.tagline,
    shortDescription: copy.entropan.shortDescription,
    features: copy.entropan.features,
    sections: copy.entropan.stories.map((s, i) => ({
      ...s,
      ...ENTROPAN_STORY_SHOTS[i],
    })),
    demos: [],
    specs: [
      ...copy.entropan.specs,
      { label: "Version", value: "0.7.0 · still moving" },
    ],
    version: "0.7.0",
    screenshot: "/screenshots/entropan.webp",
    // 2x export of the v0.7.0 UI (2440px wide before the 6px ring trim) —
    // sharp on HiDPI at the plate's 1040px render width.
    screenshotSize: { w: 2428, h: 1502 },
    cardArt: "/screenshots/entropan-card.webp",
    // Entropan's signature olive — the hue of its selected band and the
    // active modulator chip. Same ink-grade rule as the other two.
    accent: "var(--entropan-olive-ink)",
    accentWash: "var(--entropan-olive-tint)",
  },
];

export const getPlugin = (slug: string) => plugins.find((p) => p.slug === slug);
