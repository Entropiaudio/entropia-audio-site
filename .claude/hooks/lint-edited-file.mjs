/**
 * PostToolUse hook — lint the file Claude just edited.
 *
 * TypeScript strictness is off in this project (`strict: false`,
 * `noImplicitAny: false`, `@typescript-eslint/no-unused-vars` off), so ESLint's
 * react-hooks rules are the only real safety net across ~100 source files.
 * Running it per-edit catches hook-order bugs at the moment they're introduced
 * rather than at the next manual `npm run lint`.
 *
 * Interface: the hook payload arrives as JSON on stdin (NOT in env vars).
 * Exit 0 = quiet success. Exit 2 = feed stderr back to Claude.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const PROJECT = path.resolve(import.meta.dirname, "..", "..");
const ESLINT = path.join(PROJECT, "node_modules", "eslint", "bin", "eslint.js");

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
  process.exit(0); // Never break the session on a malformed payload.
}

// Edit/Write use tool_input.file_path; MultiEdit carries the same field.
const filePath = payload?.tool_input?.file_path;
if (typeof filePath !== "string" || !filePath) process.exit(0);

// Only lint TS/TSX inside src/ — configs, CSS, and markdown aren't covered by
// the flat config's `files: ["**/*.{ts,tsx}"]` block.
const rel = path.relative(PROJECT, filePath);
const isSource =
  !rel.startsWith("..") &&
  rel.split(path.sep)[0] === "src" &&
  /\.tsx?$/.test(rel);
if (!isSource || !existsSync(filePath) || !existsSync(ESLINT)) process.exit(0);

const result = spawnSync(
  process.execPath,
  [ESLINT, "--no-warn-ignored", "--format", "stylish", filePath],
  { cwd: PROJECT, encoding: "utf8", timeout: 60_000 },
);

if (result.error || result.status === 0 || result.status === null) process.exit(0);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
// ESLint exits 1 for lint errors and 2 for its own fatal errors (bad config,
// unparseable file). Only surface real lint findings; a broken ESLint install
// shouldn't nag Claude on every edit.
if (result.status === 1 && output) {
  process.stderr.write(`ESLint found problems in ${rel}:\n\n${output}\n`);
  process.exit(2);
}
process.exit(0);
