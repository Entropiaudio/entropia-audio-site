/**
 * Renders the link-preview card for every plugin: public/og/<slug>.jpg,
 * 1200x630, the plugin's GUI big on the right, its name and tagline on the
 * left, on the site's paper ground. These are what WhatsApp, iMessage, X,
 * Slack etc. show when someone shares /plugins/<slug> (crawlers don't run JS,
 * so the build bakes these into per-plugin HTML, see
 * scripts/share-pages-plugin.ts).
 *
 * Re-run whenever a plugin's screenshot, name or tagline changes, or a new
 * plugin is added, then commit the images:
 *
 *   node tools/make-share-cards.mjs            # every plugin
 *   node tools/make-share-cards.mjs entropan   # just one
 *
 * Needs Google Chrome (headless) and macOS `sips` for the JPEG encode. Names,
 * taglines, screenshots and accent colours all come from src/data/plugins.ts,
 * src/copy.ts and src/index.css, so there's nothing to edit here.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadSiteData } from "../scripts/site-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const outDir = path.join(pub, "og");
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const W = 1200;
const H = 630;
// the GUI's box: right-aligned, vertically centred, never wider/taller than this
const GUI_MAX_W = 840;
const GUI_MAX_H = 540;
const GUI_RIGHT = 40;

/* resolve `var(--x)` chains against the custom properties in index.css */
const cssVars = Object.fromEntries(
  [...fs.readFileSync(path.join(root, "src/index.css"), "utf8").matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(
    (m) => [m[1], m[2].trim()],
  ),
);
const resolveColor = (value) => {
  let v = value;
  for (let i = 0; i < 8 && /^var\(/.test(v); i++) {
    v = cssVars[v.match(/^var\((--[\w-]+)/)[1]] ?? v;
  }
  return v;
};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fileUrl = (p) => pathToFileURL(path.join(pub, p)).href;

function cardHtml(p) {
  const aspect = p.screenshotSize.w / p.screenshotSize.h;
  const guiW = Math.round(Math.min(GUI_MAX_W, GUI_MAX_H * aspect));
  const guiH = Math.round(guiW / aspect);
  const ink = resolveColor(p.accent);
  const wash = resolveColor(p.accentWash);
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Fraunces'; src: url('${fileUrl("fonts/Fraunces-Variable.woff2")}') format('woff2-variations'); font-weight: 100 900; }
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; }
  body { position: relative; background: ${resolveColor("var(--paper)")}; font-family: 'Fraunces', serif; color: ${resolveColor("var(--ink)")}; }
  .wash { position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 75% at 70% 50%, ${wash} 0%, transparent 70%),
      radial-gradient(ellipse 45% 55% at 0% 100%, rgba(194, 90, 30, 0.10) 0%, transparent 70%); }
  .brand { position: absolute; left: 56px; top: 50px; display: flex; align-items: center; gap: 12px;
    font-style: italic; font-size: 24px; }
  .brand img { width: 30px; height: 30px; }
  .copy { position: absolute; left: 56px; bottom: 62px; width: ${W - GUI_RIGHT - guiW - 56 - 36}px; }
  .name { font-size: 50px; line-height: 1; letter-spacing: -0.02em; }
  .rule { width: 48px; height: 2px; background: ${resolveColor("var(--accent-raw)")}; margin: 22px 0 20px; }
  .tag { font-style: italic; font-size: 22px; line-height: 1.3; color: ${ink}; }
  .gui { position: absolute; right: ${GUI_RIGHT}px; top: ${Math.round((H - guiH) / 2)}px;
    width: ${guiW}px; height: ${guiH}px; border-radius: 12px; object-fit: cover;
    box-shadow: 0 30px 60px -22px rgba(42, 23, 30, 0.45), 0 8px 18px rgba(42, 23, 30, 0.16); }
</style></head><body>
  <div class="wash"></div>
  <div class="brand"><img src="${fileUrl("favicon.svg")}" alt="">entropia audio</div>
  <div class="copy">
    <div class="name">${esc(p.name)}</div>
    <div class="rule"></div>
    <div class="tag">${esc(p.tagline)}</div>
  </div>
  <img class="gui" src="${fileUrl(p.screenshot.replace(/^\//, ""))}" alt="">
</body></html>`;
}

const only = process.argv.slice(2);
const { plugins } = await loadSiteData(root);
const targets = only.length ? plugins.filter((p) => only.includes(p.slug)) : plugins;
if (only.length && targets.length !== only.length) {
  console.error(`unknown slug in: ${only.join(", ")} (have: ${plugins.map((p) => p.slug).join(", ")})`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "share-cards-"));
for (const p of targets) {
  const html = path.join(tmp, `${p.slug}.html`);
  const png = path.join(tmp, `${p.slug}.png`);
  const jpg = path.join(outDir, `${p.slug}.jpg`);
  fs.writeFileSync(html, cardHtml(p));
  execFileSync(CHROME, [
    "--headless=new",
    `--screenshot=${png}`,
    `--window-size=${W},${H}`,
    "--force-device-scale-factor=1",
    "--hide-scrollbars",
    "--virtual-time-budget=10000",
    "--allow-file-access-from-files",
    pathToFileURL(html).href,
  ], { stdio: "ignore" });
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "86", png, "--out", jpg], { stdio: "ignore" });
  console.log(`${path.relative(root, jpg)}  ${Math.round(fs.statSync(jpg).size / 1024)} KB`);
}
fs.rmSync(tmp, { recursive: true, force: true });
