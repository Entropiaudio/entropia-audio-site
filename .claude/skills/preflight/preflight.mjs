/**
 * Pre-push check for the entropia site.
 *
 * Netlify auto-deploys from `main`, so anything that lands there ships. This
 * runs the same gates the deploy will, plus the two that only fail in
 * production: the lockfile drift `npm ci` hard-fails on, and CSP origins that
 * `vite dev` happily serves without.
 *
 * Usage:  node .claude/skills/preflight/preflight.mjs [--skip-build]
 */
import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { findCspGaps, loadPolicy } from "../../hooks/lib/csp.mjs";

const PROJECT = path.resolve(import.meta.dirname, "..", "..", "..");
const skipBuild = process.argv.includes("--skip-build");

const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  process.stdout.write(`${ok ? "PASS" : "FAIL"}  ${name}\n`);
  if (!ok && detail) process.stdout.write(`${detail.trim()}\n\n`);
};

const run = (name, command, args, { timeout = 300_000 } = {}) => {
  const started = Date.now();
  const r = spawnSync(command, args, {
    cwd: PROJECT,
    encoding: "utf8",
    timeout,
    shell: process.platform === "win32",
  });
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  const output = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const ok = !r.error && r.status === 0;
  record(`${name} (${secs}s)`, ok, ok ? "" : output.split("\n").slice(-25).join("\n"));
  return ok;
};

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|css|html)$/.test(entry)) out.push(full);
  }
  return out;
};

process.stdout.write("preflight — entropia audio\n\n");

// 1. Lockfile integrity. This is exactly what Netlify runs; it hard-fails if
//    package.json and package-lock.json have drifted.
run("lockfile matches package.json (npm ci --dry-run)", "npm", ["ci", "--dry-run"]);

// 2. Lint. react-hooks/rules-of-hooks is the real safety net here, since
//    TypeScript strictness is off.
run("eslint", "npm", ["run", "lint"]);

// 3. Tests.
run("vitest", "npm", ["test"]);

// 4. Production build. Also the check that VITE_MOONBASE_URL is set — the
//    build throws without it by design (vite.config.ts).
if (skipBuild) {
  record("production build (skipped)", true);
} else {
  run("production build", "npm", ["run", "build"], { timeout: 600_000 });
}

// 5. CSP coverage. Origins loaded from source that the deployed policy doesn't
//    allow: fine in dev, blocked in production.
const csp = loadPolicy(PROJECT);
if (!csp) {
  record("CSP present in public/_headers", false, "No Content-Security-Policy line found.");
} else {
  const files = [
    ...walk(path.join(PROJECT, "src")),
    path.join(PROJECT, "index.html"),
  ];
  const gaps = [];
  for (const file of files) {
    for (const gap of findCspGaps(file, csp)) {
      gaps.push(`  ${path.relative(PROJECT, file)}: ${gap.origin} → needs ${gap.directives.join(" and ")}`);
    }
  }
  record(
    `CSP covers every external origin (${files.length} files)`,
    gaps.length === 0,
    gaps.join("\n"),
  );
}

const failed = results.filter((r) => !r.ok);
process.stdout.write(
  `\n${results.length - failed.length}/${results.length} checks passed.\n`,
);
if (failed.length > 0) {
  process.stdout.write(`Blocking: ${failed.map((f) => f.name).join(", ")}\n`);
  process.exit(1);
}
process.stdout.write("Safe to push.\n");
