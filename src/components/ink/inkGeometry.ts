import { InkItem } from "@/data/inkMarks";

/** The 16 brushes in public/ink. Aspect comes from the file, never guessed. */
export const BRUSHES = [
  "el-1-0", "el-1-1", "el-1-11", "el-1-9",
  "el-2-0", "el-2-12", "el-2-13", "el-2-6", "el-2-9",
  "el-3-13", "el-3-14", "el-3-8",
  "el-4-1", "el-4-11", "el-4-3", "el-4-7",
] as const;

export const LAYERS = ["bg", "mid", "front"] as const;
/** The whole vocabulary, per the handoff. Anything else is out of register. */
export const BLENDS = ["multiply", "hard-light", "darken"] as const;

export interface Box {
  /** viewport px */
  cx: number;
  cy: number;
  w: number;
  h: number;
}

/* Brush aspect (h/w), filled in as images load. */
const aspect = new Map<string, number>();
const pending = new Set<string>();

const aspectOf = (src: string): number | null => {
  const a = aspect.get(src);
  if (a != null) return a;
  if (!pending.has(src)) {
    pending.add(src);
    const im = new Image();
    im.onload = () => aspect.set(src, im.naturalHeight / im.naturalWidth);
    im.src = src;
  }
  return null;
};

/**
 * Where a mark's box lands in the viewport — the same arithmetic InkLayer uses
 * (centre at x/y of the anchor box, width a fraction of the anchor's width,
 * height from the brush's aspect), so a handle sits exactly on its mark.
 */
export const markBox = (m: InkItem, anchor: HTMLElement | null): Box | null => {
  if (!anchor) return null;
  const r = anchor.getBoundingClientRect();
  if (!r.width) return null;
  const asp = aspectOf(m.src);
  if (asp == null) return null;
  const w = m.w * r.width;
  return {
    cx: Math.round((r.left + m.x * r.width) * 10) / 10,
    cy: Math.round((r.top + m.y * r.height) * 10) / 10,
    w: Math.round(w * 10) / 10,
    h: Math.round(w * asp * 10) / 10,
  };
};

export interface InkVerdict {
  level: "ok" | "bad";
  n: number;
  texts: string[];
  note: string;
}

/** Body copy vs display type. Below this a stain behind the letters hurts. */
const BODY_PX = 20;

/**
 * Does this mark's ink actually harm reading text?
 *
 * Not a box test — a mark's box overlapping a paragraph is normal and usually
 * fine, because most of the box is transparent and the erase strokes exist
 * precisely to open holes. This samples the *rendered* pixels (the canvas for
 * erased marks, a redraw of the brush otherwise), maps every inked sample
 * through the mark's own rotation and flips, and tests those points against
 * the glyph rectangles on the page.
 *
 * The verdict follows the design rule rather than raw contact, because the
 * three depths mean different things. A `front` mark paints *over* type, so
 * any real contact is a defect. `bg` and `mid` marks sit *under* it — the
 * handoff names "drop it to bg" as a legitimate fix for an overlap, so ink
 * behind a 60px headline is the intended stain in the stock, not a bug. What
 * is never fine is heavy ink behind small body copy, where it eats contrast.
 * Reporting those two cases the same way would make the badge noise, and a
 * warning that fires on the shipped design teaches you to ignore it.
 */
export const inkCollision = (index: number, m: InkItem): InkVerdict | null => {
  const el = document.querySelector<HTMLElement>(`[data-ink-i="${index}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;

  // rendered alpha, erasure included
  const N = 48;
  let read: (u: number, v: number) => number;
  if (el instanceof HTMLCanvasElement) {
    const cw = el.width;
    const ch = el.height;
    let data: Uint8ClampedArray;
    try {
      data = el.getContext("2d")!.getImageData(0, 0, cw, ch).data;
    } catch {
      return null;
    }
    read = (u, v) => {
      const px = Math.min(cw - 1, Math.max(0, Math.round(u * cw)));
      const py = Math.min(ch - 1, Math.max(0, Math.round(v * ch)));
      return data[(py * cw + px) * 4 + 3] / 255;
    };
  } else if (el instanceof HTMLImageElement) {
    if (!el.complete || !el.naturalWidth) return null;
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = Math.max(1, Math.round((160 * el.naturalHeight) / el.naturalWidth));
    const x = c.getContext("2d");
    if (!x) return null;
    x.drawImage(el, 0, 0, c.width, c.height);
    let data: Uint8ClampedArray;
    try {
      data = x.getImageData(0, 0, c.width, c.height).data;
    } catch {
      return null;
    }
    read = (u, v) => {
      const px = Math.min(c.width - 1, Math.max(0, Math.round(u * c.width)));
      const py = Math.min(c.height - 1, Math.max(0, Math.round(v * c.height)));
      return data[(py * c.width + px) * 4 + 3] / 255;
    };
  } else return null;

  // the mark's own box, pre-rotation: width/height as laid out
  const anchor =
    m.anchor === "__page"
      ? document.querySelector<HTMLElement>("[data-ink-root]")?.parentElement
      : document.querySelector<HTMLElement>(`[data-ink-anchor="${m.anchor}"]`);
  if (!anchor) return null;
  const ar = anchor.getBoundingClientRect();
  const bw = m.w * ar.width;
  const asp = el instanceof HTMLCanvasElement ? el.height / el.width : (el as HTMLImageElement).naturalHeight / (el as HTMLImageElement).naturalWidth;
  const bh = bw * asp;
  const cx = ar.left + m.x * ar.width;
  const cy = ar.top + m.y * ar.height;
  const rad = (m.rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // glyph boxes, ink layers excluded
  const glyphs: { l: number; t: number; r: number; b: number; txt: string; px: number }[] = [];
  const range = document.createRange();
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walk.nextNode())) {
    const text = node.textContent?.trim();
    if (!text) continue;
    const parent = (node as Text).parentElement;
    // the ink layers, and the editor's own chrome — its panel sits over the
    // right margin, which is exactly where the page-anchored marks live
    if (!parent || parent.closest("[data-ink-root],[data-ink-front],[data-ink-mid],[data-ink-bg],[data-ink-ui]"))
      continue;
    const cs = getComputedStyle(parent);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
    const size = parseFloat(cs.fontSize) || 16;
    range.selectNodeContents(node);
    for (const g of range.getClientRects()) {
      if (!g.width || !g.height) continue;
      if (g.bottom < r.top - 8 || g.top > r.bottom + 8 || g.right < r.left - 8 || g.left > r.right + 8) continue;
      glyphs.push({ l: g.left, t: g.top, r: g.right, b: g.bottom, txt: text.slice(0, 28), px: size });
    }
  }
  if (!glyphs.length) return { level: "ok", n: 0, texts: [], note: "clear of reading text" };

  const front = m.layer === "front";
  // over type, a whisper already shows; under it, only heavy ink costs contrast
  const floor = front ? 0.06 : 0.3;
  let n = 0;
  let onBody = 0;
  const texts = new Set<string>();
  const bodyTexts = new Set<string>();
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      const u = (gx + 0.5) / N;
      const v = (gy + 0.5) / N;
      if (read(u, v) * m.op <= floor) continue;
      const lx = (m.fx ? 1 - u : u) - 0.5;
      const ly = (m.fy ? 1 - v : v) - 0.5;
      const px = cx + (lx * bw * cos - ly * bh * sin);
      const py = cy + (lx * bw * sin + ly * bh * cos);
      for (const g of glyphs) {
        if (px >= g.l && px <= g.r && py >= g.t && py <= g.b) {
          n++;
          texts.add(g.txt);
          if (g.px < BODY_PX) {
            onBody++;
            bodyTexts.add(g.txt);
          }
          break;
        }
      }
    }
  }

  if (front && n > 0)
    return { level: "bad", n, texts: [...texts].slice(0, 3), note: "painting over type — move it, shrink it, or drop it to mid" };
  if (onBody > 0)
    return { level: "bad", n: onBody, texts: [...bodyTexts].slice(0, 3), note: "heavy ink behind body copy — move it, lower opacity, or erase that part" };
  if (n > 0)
    return { level: "ok", n, texts: [...texts].slice(0, 3), note: "under display type only — the intended stain" };
  return { level: "ok", n: 0, texts: [], note: "clear of reading text" };
};
