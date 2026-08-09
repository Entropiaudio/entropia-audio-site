/**
 * PostToolUse hook — catch "works locally, blocked in production".
 *
 * This site has no backend, so the CSP in public/_headers is the primary
 * server-side control (SECURITY.md). Netlify only applies it to the deployed
 * site — `vite dev` serves without it. So an added external script, iframe,
 * font, stylesheet, websocket, or fetch target works perfectly in dev and is
 * silently blocked in production, where checkout is the thing that breaks.
 *
 * The analysis lives in lib/csp.mjs, shared with the /preflight skill.
 *
 * Interface: payload arrives as JSON on stdin. Exit 2 sends stderr to Claude.
 */
import path from "node:path";
import process from "node:process";
import { findCspGaps, loadPolicy } from "./lib/csp.mjs";

const PROJECT = path.resolve(import.meta.dirname, "..", "..");

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

const main = async () => {
  const raw = await readStdin();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return 0;
  }

  const filePath = payload?.tool_input?.file_path;
  if (typeof filePath !== "string" || !filePath) return 0;

  const resolved = path.resolve(filePath);
  const rel = path.relative(PROJECT, resolved);
  if (rel.startsWith("..")) return 0;

  const gaps = findCspGaps(resolved, loadPolicy(PROJECT));
  if (gaps.length === 0) return 0;

  const lines = gaps.map(
    ({ origin, directives }) => `  ${origin}  → needs ${directives.join(" and ")}`,
  );
  process.stderr.write(
    `CSP gap in ${rel}: this loads external origins the Content-Security-Policy in ` +
      `public/_headers does not allow. It will work in \`npm run dev\` and be blocked ` +
      `in production.\n\n${lines.join("\n")}\n\n` +
      `Add each origin to the matching directive in public/_headers, and note the ` +
      `change in SECURITY.md. Never widen script-src or form-action to a ` +
      `*.moonbase.sh wildcard — that host is multi-tenant.\n`,
  );
  return 2;
};

process.exit(await main());
