import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Dev-only endpoint that lets the in-app ink editor write placements back to
 * src/data/inkMarks.ts.
 *
 * `apply: "serve"` keeps it out of every build, so nothing here can reach
 * production. It rewrites exactly one region of one file — the block between
 * the <ink-placements> markers — so the ERASE stroke data and the file's
 * header survive every save.
 *
 * The payload is validated field by field before anything is written. This is
 * a process that turns a POST body into source code, and a dev server is
 * reachable from the local network (`host: "::"`), so "it's only dev" is not
 * a reason to trust the input: every string that reaches the file is either
 * matched against a whitelist or JSON-escaped.
 */

const FILE = "src/data/inkMarks.ts";
const START = "// <ink-placements>";
const END = "// </ink-placements>";

const LAYERS = new Set(["bg", "mid", "front"]);
const BLENDS = new Set(["multiply", "hard-light", "darken"]);
const SRC_RE = /^\/ink\/[a-z0-9-]+\.webp$/;
const ERASE_REF_RE = /^[a-z0-9-]+$/;
const PAGE_KEY_RE = /^[a-z0-9-]+$/;

interface CleanMark {
  src: string;
  anchor: string;
  layer: string;
  x: number;
  y: number;
  w: number;
  rot: number;
  op: number;
  blend: string;
  fx: boolean;
  fy: boolean;
  eraseRef?: string;
  note?: string;
}

const num = (v: unknown, field: string, lo: number, hi: number): number => {
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`${field}: not a finite number`);
  if (v < lo || v > hi) throw new Error(`${field}: ${v} out of range ${lo}..${hi}`);
  // 4dp is finer than anything placeable by hand and keeps diffs readable
  return Math.round(v * 1e4) / 1e4;
};

const str = (v: unknown, field: string, max = 400): string => {
  if (typeof v !== "string") throw new Error(`${field}: not a string`);
  if (v.length > max) throw new Error(`${field}: longer than ${max} chars`);
  return v;
};

const cleanMark = (raw: unknown, where: string): CleanMark => {
  if (!raw || typeof raw !== "object") throw new Error(`${where}: not an object`);
  const m = raw as Record<string, unknown>;
  const src = str(m.src, `${where}.src`, 120);
  if (!SRC_RE.test(src)) throw new Error(`${where}.src: ${src} is not a /ink/*.webp path`);
  const layer = str(m.layer, `${where}.layer`, 10);
  if (!LAYERS.has(layer)) throw new Error(`${where}.layer: ${layer}`);
  const blend = str(m.blend, `${where}.blend`, 20);
  if (!BLENDS.has(blend)) throw new Error(`${where}.blend: ${blend}`);
  const out: CleanMark = {
    src,
    // anchors are authored in the pages as free text; length-capped and
    // JSON-escaped on the way out, never interpolated raw
    anchor: str(m.anchor, `${where}.anchor`, 80),
    layer,
    x: num(m.x, `${where}.x`, -5, 5),
    y: num(m.y, `${where}.y`, -5, 5),
    w: num(m.w, `${where}.w`, 0.005, 3),
    rot: num(m.rot, `${where}.rot`, -360, 360),
    op: num(m.op, `${where}.op`, 0, 1),
    blend,
    fx: m.fx === true,
    fy: m.fy === true,
  };
  if (m.eraseRef != null) {
    const ref = str(m.eraseRef, `${where}.eraseRef`, 60);
    if (!ERASE_REF_RE.test(ref)) throw new Error(`${where}.eraseRef: ${ref}`);
    out.eraseRef = ref;
  }
  if (m.note != null) out.note = str(m.note, `${where}.note`, 600);
  return out;
};

const wrapNote = (text: string, indent: string): string => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (line && (line + " " + w).length > 74) {
      lines.push(line);
      line = w;
    } else line = line ? line + " " + w : w;
  }
  if (line) lines.push(line);
  return lines.map((l) => `${indent}// ${l}`).join("\n");
};

const serialize = (pages: Record<string, CleanMark[]>): string => {
  let out = `${START}  —  DO NOT hand-edit between these markers.
// This block is rewritten verbatim by the in-app ink editor (dev only, see
// src/components/ink/InkEditor.tsx). Anything you type here — including
// comments other than each mark's \`note\` — is lost on the next save. The
// ERASE data above and this file's header are never touched by the editor.
export const INK_PAGES: Record<string, InkItem[]> = {
`;
  for (const [page, marks] of Object.entries(pages)) {
    out += `  // ${page} — ${marks.length} mark${marks.length === 1 ? "" : "s"}\n`;
    out += `  ${JSON.stringify(page)}: [\n`;
    for (const m of marks) {
      if (m.note) out += wrapNote(m.note, "    ") + "\n";
      out += `    {\n`;
      out += `      src: ${JSON.stringify(m.src)},\n`;
      out += `      anchor: ${JSON.stringify(m.anchor)},\n`;
      out += `      layer: ${JSON.stringify(m.layer)},\n`;
      out += `      x: ${m.x},\n      y: ${m.y},\n      w: ${m.w},\n`;
      out += `      rot: ${m.rot},\n      op: ${m.op},\n`;
      out += `      blend: ${JSON.stringify(m.blend)},\n`;
      out += `      fx: ${m.fx},\n      fy: ${m.fy},\n`;
      if (m.eraseRef) out += `      eraseRef: ${JSON.stringify(m.eraseRef)},\n`;
      if (m.note) out += `      note: ${JSON.stringify(m.note)},\n`;
      out += `    },\n`;
    }
    out += `  ],\n`;
  }
  out += `};\n${END}\n`;
  return out;
};

export const inkSavePlugin = (): Plugin => ({
  name: "entropia-ink-save",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/__ink/save", (req, res) => {
      const done = (code: number, body: unknown) => {
        res.statusCode = code;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(body));
      };
      if (req.method !== "POST") return done(405, { ok: false, error: "POST only" });

      let raw = "";
      let tooBig = false;
      req.on("data", (chunk) => {
        raw += chunk;
        if (raw.length > 2_000_000 && !tooBig) {
          tooBig = true;
          req.destroy();
        }
      });
      req.on("end", () => {
        if (tooBig) return done(413, { ok: false, error: "payload too large" });
        try {
          const body = JSON.parse(raw) as { pages?: unknown };
          if (!body.pages || typeof body.pages !== "object") throw new Error("missing pages");
          const pages: Record<string, CleanMark[]> = {};
          for (const [key, marks] of Object.entries(body.pages as Record<string, unknown>)) {
            if (!PAGE_KEY_RE.test(key)) throw new Error(`page key: ${key}`);
            if (!Array.isArray(marks)) throw new Error(`page ${key}: not an array`);
            if (marks.length > 64) throw new Error(`page ${key}: too many marks`);
            pages[key] = marks.map((m, i) => cleanMark(m, `${key}[${i}]`));
          }

          const file = path.resolve(server.config.root, FILE);
          const src = fs.readFileSync(file, "utf8");
          const a = src.indexOf(START);
          const b = src.indexOf(END);
          if (a < 0 || b < 0 || b < a) throw new Error(`markers not found in ${FILE}`);
          const next = src.slice(0, a) + serialize(pages) + src.slice(b + END.length + 1);
          fs.writeFileSync(file, next, "utf8");

          const total = Object.values(pages).reduce((s, m) => s + m.length, 0);
          server.config.logger.info(`  ink  saved ${total} marks → ${FILE}`);
          done(200, { ok: true, total });
        } catch (err) {
          done(400, { ok: false, error: err instanceof Error ? err.message : String(err) });
        }
      });
    });
  },
});
