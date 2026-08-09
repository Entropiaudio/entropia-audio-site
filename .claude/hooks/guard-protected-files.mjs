/**
 * PreToolUse hook — guard the files that break production silently.
 *
 * Two tiers:
 *   DENY  — secrets and the lockfile. Netlify builds with `npm ci`
 *           (netlify.toml), which hard-fails on any package.json/lockfile
 *           drift, so the lockfile must only ever be written by npm itself.
 *           .env* holds real credentials and is gitignored.
 *   ASK   — deploy-critical config: the CSP/header file, the Netlify build
 *           config, and the Vite build guard. These are legitimately edited
 *           (a new external origin needs a CSP entry) but a silent edit here
 *           is how a site ships a broken checkout, so surface it.
 *
 * Interface: payload arrives as JSON on stdin. Exit 2 blocks the call and
 * sends stderr to Claude. A JSON body on stdout with
 * hookSpecificOutput.permissionDecision drives the ask tier; on a runtime that
 * doesn't parse it the call simply proceeds, which is the safe degradation.
 */
import path from "node:path";
import process from "node:process";

const PROJECT = path.resolve(import.meta.dirname, "..", "..");

const DENY = [
  {
    match: (rel) => /^\.env(\..*)?$/.test(rel),
    reason:
      "`.env` files hold real credentials and are gitignored. Edit them yourself, " +
      "or tell the user which variable to set (and remind them Netlify needs the " +
      "same value under site settings → environment variables).",
  },
  {
    match: (rel) => rel === "package-lock.json",
    reason:
      "package-lock.json must only be written by npm. Netlify builds with `npm ci`, " +
      "which hard-fails if the lockfile and package.json drift — a hand-edit breaks " +
      "the deploy. Run `npm install <pkg>` and commit both files together.",
  },
];

const ASK = [
  {
    match: (rel) => rel === path.join("public", "_headers"),
    reason:
      "public/_headers carries the CSP and security headers documented in SECURITY.md. " +
      "script-src and form-action are pinned to the exact Moonbase tenant host on " +
      "purpose (moonbase.sh is multi-tenant). Confirm this change is intended.",
  },
  {
    match: (rel) => rel === "netlify.toml",
    reason:
      "netlify.toml controls how production is built and published. Confirm this " +
      "change is intended.",
  },
  {
    match: (rel) => rel === "vite.config.ts",
    reason:
      "vite.config.ts holds the storefront-integrity guard that hard-fails a " +
      "production build without VITE_MOONBASE_URL. Confirm this change is intended.",
  },
];

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

const raw = await readStdin();
let payload;
try {
  payload = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path;
if (typeof filePath !== "string" || !filePath) process.exit(0);

const rel = path.relative(PROJECT, path.resolve(filePath));
if (rel.startsWith("..")) process.exit(0); // outside the project — not ours to guard

const denied = DENY.find((r) => r.match(rel));
if (denied) {
  process.stderr.write(`Blocked edit to ${rel}. ${denied.reason}\n`);
  process.exit(2);
}

const asked = ASK.find((r) => r.match(rel));
if (asked) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: asked.reason,
      },
    }),
  );
  process.exit(0);
}

process.exit(0);
