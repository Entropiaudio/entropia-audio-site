import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin as VitePlugin } from "vite";
// plain .mjs so tools/make-share-cards.mjs can share it
import { loadSiteData } from "./site-data.mjs";

const SITE = "https://entropiaudio.com";
const DESCRIPTION_MAX = 200;

/**
 * Link previews for product pages.
 *
 * The site is a single-page app: every URL is served the same index.html, and
 * WhatsApp / iMessage / X / Slack / Facebook read meta tags without running
 * JS, so a shared /plugins/entropan used to preview as the generic brand card.
 * After each build this writes dist/plugins/<slug>.html: the identical app
 * shell (same scripts, the app boots as normal) with that plugin's title,
 * description and GUI card (public/og/<slug>.jpg) in the meta tags. Netlify
 * serves a real file ahead of the SPA fallback in _redirects, and its pretty
 * URLs map /plugins/<slug> to plugins/<slug>.html.
 *
 * Every plugin in src/data/plugins.ts gets a page automatically. A plugin
 * with no card yet falls back to the site card (with a warning); make one with
 * `node tools/make-share-cards.mjs <slug>`.
 */
export function sharePagesPlugin(): VitePlugin {
  let root = "";
  let outDir = "";
  return {
    name: "entropia-share-pages",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const shell = await fs.readFile(path.join(outDir, "index.html"), "utf8");
      const { plugins, copy } = await loadSiteData(root);
      await fs.mkdir(path.join(outDir, "plugins"), { recursive: true });

      for (const p of plugins) {
        const card = await cardUrl(outDir, p.slug);
        if (!card) {
          this.warn(`no public/og/${p.slug}.jpg, ${p.slug} shares with the site card. run: node tools/make-share-cards.mjs ${p.slug}`);
        }
        const tabTitle = (copy.tabTitles as Record<string, string>)[p.slug];
        const html = withMeta(shell, {
          title: `${tabTitle ?? p.name}${copy.tabTitles.suffix}`,
          ogTitle: `${p.name} · entropia audio`,
          description: clip(p.shortDescription, DESCRIPTION_MAX),
          url: `${SITE}/plugins/${p.slug}`,
          image: card ?? `${SITE}/og.png?v=2`,
          imageAlt: `${p.name} plugin interface`,
        });
        await fs.writeFile(path.join(outDir, "plugins", `${p.slug}.html`), html);
      }
    },
  };
}

/** absolute card URL, cache-busted by content so re-renders refresh previews */
async function cardUrl(outDir: string, slug: string) {
  try {
    const bytes = await fs.readFile(path.join(outDir, "og", `${slug}.jpg`));
    const v = createHash("sha1").update(bytes).digest("hex").slice(0, 8);
    return `${SITE}/og/${slug}.jpg?v=${v}`;
  } catch {
    return undefined;
  }
}

const clip = (s: string, max: number) =>
  s.length <= max ? s : `${s.slice(0, s.lastIndexOf(" ", max - 1))}…`;

const escAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Meta = {
  title: string;
  ogTitle: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
};

/** swaps the shell's meta values; throws if index.html no longer has a tag */
function withMeta(shell: string, m: Meta) {
  let html = shell;
  const set = (pattern: RegExp, value: string) => {
    if (!pattern.test(html)) throw new Error(`[share-pages] index.html is missing ${pattern}`);
    html = html.replace(pattern, (_, open, close) => `${open}${value}${close}`);
  };
  const content = (attr: "name" | "property", key: string) =>
    new RegExp(`(<meta ${attr}="${key.replace(/:/g, "\\:")}" content=")[^"]*(")`);

  set(/(<title>)[^<]*(<\/title>)/, escAttr(m.title));
  set(content("name", "description"), escAttr(m.description));
  set(content("property", "og:title"), escAttr(m.ogTitle));
  set(content("property", "og:description"), escAttr(m.description));
  set(content("property", "og:url"), escAttr(m.url));
  set(content("property", "og:image"), escAttr(m.image));
  set(content("name", "twitter:title"), escAttr(m.ogTitle));
  set(content("name", "twitter:description"), escAttr(m.description));
  set(content("name", "twitter:image"), escAttr(m.image));

  const alt = escAttr(m.imageAlt);
  return html.replace(
    /(<meta name="twitter:image" content="[^"]*" \/>)/,
    `$1\n    <meta property="og:image:alt" content="${alt}" />\n    <meta name="twitter:image:alt" content="${alt}" />`,
  );
}
