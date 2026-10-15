/**
 * The product records point at files under /public and declare those files'
 * pixel sizes by hand (PluginShot reserves the frame from the numbers before
 * the image loads). Nothing at build time checks either, so a renamed export
 * or a stale size ships silently: a broken image on a card, or a plate that
 * jumps when it paints. This pins both to the files actually in the repo.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { plugins } from "./plugins";
import { copy } from "@/copy";

const PUBLIC = join(__dirname, "..", "..", "public");

/** Natural pixel size of a WebP file, from its container header. */
const webpSize = (file: string): { w: number; h: number } | null => {
  const b = readFileSync(file);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    // lossy: frame tag (3) + start code (3), then 14-bit width and height
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
  }
  return null;
};

describe("plugin records", () => {
  it("have unique slugs that match their copy and card blocks", () => {
    const slugs = plugins.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of plugins) {
      // every product has a copy block of its own name, with a homepage card
      const block = copy[p.slug as keyof typeof copy] as { name?: string; card?: object };
      expect(block?.name, `copy.${p.slug}`).toBe(p.name);
      expect(block?.card, `copy.${p.slug}.card`).toBeTruthy();
      expect(copy.tabTitles[p.slug as keyof typeof copy.tabTitles], `tabTitles.${p.slug}`).toBeTruthy();
    }
  });

  it("only price what is released", () => {
    for (const p of plugins) {
      if (p.status === "released") expect(p.price, p.slug).toBeGreaterThan(0);
      else expect(p.price, p.slug).toBeUndefined();
    }
  });

  it("point at screenshots and card art that exist under /public", () => {
    for (const p of plugins) {
      const files = [
        p.screenshot,
        p.cardArt,
        ...(p.skins ? [p.skins.night, p.skins.daylight] : []),
        ...(p.sections ?? []).map((s) => s.shot).filter(Boolean),
      ];
      for (const f of files) {
        expect(existsSync(join(PUBLIC, f)), `${p.slug}: ${f}`).toBe(true);
      }
    }
  });

  it("show the daylight skin wherever there's no switch", () => {
    for (const p of plugins) {
      if (p.skins) expect(p.screenshot, p.slug).toBe(p.skins.daylight);
    }
  });

  it("declare the sizes the files actually have", () => {
    for (const p of plugins) {
      const declared = [
        { file: p.screenshot, size: p.screenshotSize },
        // the skin switch crossfades in one frame, so both skins share its size
        ...(p.skins
          ? [p.skins.night, p.skins.daylight].map((file) => ({ file, size: p.screenshotSize }))
          : []),
        ...(p.sections ?? [])
          .filter((s) => s.shot && s.shotSize)
          .map((s) => ({ file: s.shot, size: s.shotSize })),
      ];
      for (const { file, size } of declared) {
        const actual = webpSize(join(PUBLIC, file));
        expect(actual, `${p.slug}: ${file} is not a WebP this test can read`).not.toBeNull();
        expect(actual, `${p.slug}: ${file}`).toEqual(size);
      }
      // the home card crops to 3:2 — art at any other ratio gets cut
      const card = webpSize(join(PUBLIC, p.cardArt));
      expect(card && Math.abs(card.w / card.h - 1.5) < 0.01, `${p.slug}: ${p.cardArt} is not 3:2`).toBe(true);
    }
  });
});
