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
  sections?: readonly { heading: string; body: string }[];
  demos: PluginDemo[];
  specs?: readonly { label: string; value: string }[];
  version: string;
  /** path under /public — the plugin UI, shown big on the product page. */
  screenshot: string;
  /** path under /public — the 3:2 art on the homepage card. */
  cardArt: string;
  /** the hue that codes this plugin on cards and in its numbered lists. */
  accent: string;
  /** Public installer URLs. Leave undefined to show a "coming soon" state. */
  downloadMacUrl?: string;
  downloadWinUrl?: string;
};

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
    cardArt: "/screenshots/chaosverb-card.webp",
    accent: "var(--accent-raw)",
  },
  {
    slug: "fiction",
    name: copy.fiction.name,
    status: "in-development",
    tagline: copy.fiction.tagline,
    shortDescription: copy.fiction.shortDescription,
    features: copy.fiction.features,
    demos: [],
    version: "1.42.0",
    screenshot: "/screenshots/fiction.webp",
    cardArt: "/screenshots/fiction-card.webp",
    accent: "var(--section-motion)",
  },
];

export const getPlugin = (slug: string) => plugins.find((p) => p.slug === slug);
