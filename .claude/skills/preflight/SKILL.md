---
name: preflight
description: Run every gate the Netlify deploy will run, before pushing — lockfile drift, lint, tests, production build, and CSP coverage. Use before pushing to main or opening a PR.
disable-model-invocation: true
---

# preflight

Netlify auto-deploys from `main`, so whatever lands there ships. This runs the same
gates the deploy runs, plus the two classes of failure that *only* appear in production
and never in `npm run dev`.

## Run it

```bash
node .claude/skills/preflight/preflight.mjs
```

Add `--skip-build` for a fast pass when you only touched tests or docs.

## What it checks, and why each one exists

| Check | Why it can only be caught here |
|---|---|
| `npm ci --dry-run` | Netlify builds with `npm ci`, which **hard-fails** if `package.json` and `package-lock.json` have drifted. `npm install` locally papers over the drift; `npm ci` won't. |
| `npm run lint` | TypeScript strictness is off in this project (`strict: false`, `noImplicitAny: false`, unused-vars disabled), so ESLint's `react-hooks` rules are the only real safety net. |
| `npm test` | Vitest. The Moonbase mapper suite in `src/lib/moonbase-state.test.ts` guards the path where a wrong number means a wrong charge. |
| `npm run build` | The production build **throws** without `VITE_MOONBASE_URL` (see `vite.config.ts`) — deliberately, so a non-functional storefront can't deploy. This is where a missing env var surfaces. |
| CSP coverage | `vite dev` serves with no Content-Security-Policy; Netlify applies the one in `public/_headers`. A newly added external script, iframe, font, stylesheet, websocket, or fetch target works perfectly on localhost and is blocked in production. |

## Reading the output

Each line is `PASS` or `FAIL` with the elapsed time; failures print the tail of their
output. Exit code is non-zero if anything failed.

## Fixing the two non-obvious failures

**Lockfile drift** — don't hand-edit `package-lock.json` (a hook blocks it). Run
`npm install <pkg>` and commit `package.json` and the lockfile together.

**CSP gap** — add the origin to the matching directive in `public/_headers`, then note
the change in `SECURITY.md`. Add to `connect-src` / `frame-src` freely; those don't
execute script in our origin. **Never** widen `script-src` or `form-action` to a
`https://*.moonbase.sh` wildcard — that host is multi-tenant, so another tenant could
serve script into our origin.

## After it passes

`VITE_MOONBASE_URL` must also be set in *Netlify → site settings → environment
variables*, and env-var changes there do **not** retroactively rebuild — trigger a fresh
deploy if you changed one.
