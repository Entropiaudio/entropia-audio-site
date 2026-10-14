/**
 * Loads the site's product data (src/data/plugins.ts + src/copy.ts) in plain
 * Node, outside the browser bundle. Used by the share-pages build plugin and
 * by tools/make-share-cards.mjs, so both read the exact same names, taglines
 * and screenshot paths the site renders, with no second copy to keep in sync.
 *
 * The data files import each other through the "@/" alias, which Node doesn't
 * understand, so esbuild bundles them first (resolving "@/" to src/) and the
 * result is imported from memory.
 */
import { build } from "esbuild";
import path from "node:path";

/** @param {string} root project root (the folder holding src/) */
export async function loadSiteData(root) {
  const srcDir = path.join(root, "src");
  const result = await build({
    stdin: {
      contents:
        'export { plugins } from "@/data/plugins"; export { copy } from "@/copy";',
      resolveDir: root,
      loader: "ts",
      sourcefile: "site-data-entry.ts",
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    logLevel: "silent",
    plugins: [
      {
        name: "at-alias",
        setup(b) {
          b.onResolve({ filter: /^@\// }, (args) =>
            b.resolve(`./${args.path.slice(2)}`, {
              resolveDir: srcDir,
              kind: args.kind,
            }),
          );
        },
      },
    ],
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}
