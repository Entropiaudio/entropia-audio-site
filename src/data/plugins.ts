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
 *   - audio file paths under /public
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

export type Plugin = {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  /** active sale price */
  price: number;
  /** crossed-out regular price; shown as "regular" when greater than price */
  regularPrice: number;
  features: readonly string[];
  sections: readonly { heading: string; body: string }[];
  demos: PluginDemo[];
  specs: readonly { label: string; value: string }[];
  version: string;
  /** path under /public, e.g. /screenshots/chaosverb.png. empty = placeholder. */
  screenshot: string;
  /** Public installer URLs. Leave undefined to show a "coming soon" state. */
  downloadMacUrl?: string;
  downloadWinUrl?: string;
};

export const plugins: Plugin[] = [
  {
    slug: "chaosverb",
    name: copy.chaosverb.name,
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
    screenshot: "/screenshots/chaosverb.png",
  },
];

export const getPlugin = (slug: string) => plugins.find((p) => p.slug === slug);
