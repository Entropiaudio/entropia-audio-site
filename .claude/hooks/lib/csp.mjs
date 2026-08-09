/**
 * Shared CSP analysis — used by the csp-cross-check PostToolUse hook and by
 * the /preflight skill, so both apply exactly the same rules.
 *
 * The question it answers: does this file load an external origin in a context
 * the Content-Security-Policy governs, which no directive currently allows?
 * `vite dev` serves without the policy, so those only fail once deployed.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/** Contexts the CSP actually governs, and the directive(s) that govern them.
 *  A load is a violation only when NONE of its candidate directives allow it.
 *  Plain <a href> navigation is absent on purpose — these directives don't
 *  restrict it. */
export const CONTEXTS = [
  { re: /<script\b[^>]*\bsrc\s*=\s*["'`]?(https?:\/\/[^"'`\s>]+)/gi, directives: ["script-src"] },
  { re: /\bimport\s*\(\s*["'`](https?:\/\/[^"'`]+)/gi, directives: ["script-src"] },
  { re: /<iframe\b[^>]*\bsrc\s*=\s*["'`]?(https?:\/\/[^"'`\s>]+)/gi, directives: ["frame-src"] },
  { re: /\bfetch\s*\(\s*["'`](https?:\/\/[^"'`]+)/gi, directives: ["connect-src"] },
  { re: /\bnew\s+WebSocket\s*\(\s*["'`](wss?:\/\/[^"'`]+)/gi, directives: ["connect-src"] },
  { re: /\bnew\s+EventSource\s*\(\s*["'`](https?:\/\/[^"'`]+)/gi, directives: ["connect-src"] },
  { re: /\bnew\s+Worker\s*\(\s*["'`](https?:\/\/[^"'`]+)/gi, directives: ["worker-src"] },
  { re: /\bnavigator\.sendBeacon\s*\(\s*["'`](https?:\/\/[^"'`]+)/gi, directives: ["connect-src"] },
  { re: /<link\b[^>]*\bhref\s*=\s*["'`]?(https?:\/\/[^"'`\s>]+)/gi, directives: ["style-src", "font-src"] },
  { re: /\bsrc\s*:\s*url\(\s*["'`]?(https?:\/\/[^"'`)\s]+)/gi, directives: ["font-src"] },
  { re: /<form\b[^>]*\baction\s*=\s*["'`]?(https?:\/\/[^"'`\s>]+)/gi, directives: ["form-action"] },
];

/** Fetch directives fall back to default-src when absent; navigation ones don't. */
const FALLS_BACK_TO_DEFAULT = new Set([
  "script-src",
  "connect-src",
  "frame-src",
  "font-src",
  "style-src",
  "worker-src",
  "img-src",
]);

/** Drop line comments, block comments, and shell-style comments so a URL merely
 *  discussed in prose never trips the check. */
export const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/^[ \t]*#.*$/gm, " ");

const originOf = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

/** Parse a policy string into directive → source list. */
export const parseCsp = (policy) => {
  const map = new Map();
  for (const part of policy.split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    map.set(tokens[0].toLowerCase(), tokens.slice(1));
  }
  return map;
};

/** Does a CSP source expression cover this origin? Handles exact hosts,
 *  scheme-only sources (`https:`), and single-label wildcards. */
export const covers = (source, origin) => {
  const src = source.trim();
  if (!src || src.startsWith("'")) return false;
  // Scheme-only source, e.g. `https:` in img-src — allows any host on it.
  if (/^[a-z][a-z0-9+.-]*:$/i.test(src)) return origin.startsWith(src);

  const schemeOf = (s) => (s.match(/^([a-z][a-z0-9+.-]*):\/\//i) ?? [, null])[1];
  const hostOf = (s) => s.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").replace(/\/.*$/, "");

  const srcScheme = schemeOf(src);
  // An explicit scheme in the source must match the one being loaded.
  if (srcScheme && srcScheme.toLowerCase() !== (schemeOf(origin) ?? "").toLowerCase()) {
    return false;
  }
  const pattern = hostOf(src);
  const host = hostOf(origin);
  if (pattern === host) return true;
  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(1); // ".moonbase.sh"
    return host.endsWith(suffix) && host.length > suffix.length;
  }
  return false;
};

/** Sources effective for a directive, applying default-src fallback. */
const sourcesFor = (csp, directive) => {
  if (csp.has(directive)) return csp.get(directive);
  if (FALLS_BACK_TO_DEFAULT.has(directive)) return csp.get("default-src") ?? [];
  return [];
};

/** Read the deployed policy out of public/_headers. Returns null if absent. */
export const loadPolicy = (projectRoot) => {
  const headers = path.join(projectRoot, "public", "_headers");
  if (!existsSync(headers)) return null;
  const line = readFileSync(headers, "utf8")
    .split(/\r?\n/)
    .find((l) => /^\s*Content-Security-Policy\s*:/i.test(l));
  if (!line) return null;
  return parseCsp(line.replace(/^\s*Content-Security-Policy\s*:/i, ""));
};

/** Origins a file loads that the policy does not allow.
 *  → [{ origin, directives: string[] }] */
export const findCspGaps = (filePath, csp) => {
  if (!csp || !existsSync(filePath)) return [];
  if (!/\.(tsx?|jsx?|css|html)$/.test(filePath)) return [];

  const source = stripComments(readFileSync(filePath, "utf8"));
  const findings = new Map();

  for (const { re, directives } of CONTEXTS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(source)) !== null) {
      const origin = originOf(m[1]);
      if (!origin) continue;
      // Allowed if ANY candidate directive covers it (a <link> may legitimately
      // be governed by style-src or font-src depending on its rel).
      const allowed = directives.some((d) =>
        sourcesFor(csp, d).some((s) => covers(s, origin)),
      );
      if (allowed) continue;
      if (!findings.has(origin)) findings.set(origin, new Set());
      for (const d of directives) findings.get(origin).add(d);
    }
  }

  return [...findings.entries()].map(([origin, directives]) => ({
    origin,
    directives: [...directives],
  }));
};
