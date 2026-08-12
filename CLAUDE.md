# entropia audio — website

Marketing + storefront SPA for entropia audio (audio plugins; flagship product
**Chaosverb**). Vite 7 + React 18 + TypeScript, Tailwind + shadcn/ui, deployed to
Netlify from `main`.

## Commands

```sh
npm run dev        # dev server on :8080  (prefer the preview tooling over raw shell)
npm run build      # production build — HARD-FAILS without VITE_MOONBASE_URL
npm run build:dev  # non-production build, exempt from the env guard
npm run lint       # eslint (flat config)
npm test           # vitest, single run
```

## Hard rules

These break production silently or loudly if ignored.

1. **`VITE_MOONBASE_URL` is required.** A `mode=production` build throws without it
   ([vite.config.ts](vite.config.ts)). Moonbase is the *only* backend for accounts,
   cart, and checkout — there is no local fallback (the old localStorage prototype
   was deleted; don't reintroduce one).
2. **Never hand-edit `package-lock.json`.** Netlify builds with `npm ci`
   ([netlify.toml](netlify.toml)), which hard-fails on any lockfile/package.json
   drift. Change deps with `npm install`, commit both files together.
3. **Any new external origin needs a CSP entry.** [public/_headers](public/_headers)
   pins `script-src`/`form-action` to `'self'` + the exact Moonbase tenant host
   (deliberately *not* a `*.moonbase.sh` wildcard — moonbase.sh is multi-tenant).
   Adding a font CDN, analytics script, or embed without updating the CSP means it
   works locally and is blocked in production. See [SECURITY.md](SECURITY.md).
4. **All user-facing copy lives in [src/copy.ts](src/copy.ts).** Don't inline strings
   in components. The file is written for a non-developer to edit; keep its comment
   style and key names intact. Tab title + SEO meta are the exception — those live in
   [index.html](index.html).
5. **Design tokens live in [src/index.css](src/index.css).** No raw hex in components.
   See the `design-tokens` skill.

## Architecture

**Moonbase "path B" integration.** The site keeps its own marketing/cart/account
pages; the Moonbase modal owns sign-in, sign-up, cart mutations, checkout, and
account management. Data flows one way:

```
@moonbase.sh/storefront  →  MoonbaseEvent.*  →  src/lib/moonbase-state.ts (stores)
                                                    ↓ useSyncExternalStore
                                            AuthContext / CartContext  →  components
```

- [src/lib/moonbase.ts](src/lib/moonbase.ts) — the single point of contact with the
  SDK: `initMoonbase()`, theming, `DISPLAY_CURRENCY`.
- [src/lib/moonbase-state.ts](src/lib/moonbase-state.ts) — event mirror. Projects the
  wide, zod-inferred SDK surface into four small stores (user, cart, pricing, ready).
  Mapping is *defensively* written: unknown shapes fall through to defaults rather
  than throwing. Keep it that way.
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) /
  [src/context/CartContext.tsx](src/context/CartContext.tsx) — read-only projections
  plus intent-firing actions. Several actions (`remove`, `setQuantity`, `clear`,
  `signOut`, `updateEmail`) intentionally just open a Moonbase modal, because the SDK
  exposes no programmatic primitive. That's a deliberate seam, not a stub to "fix".

The site never handles credentials or card data — that's the core security claim in
SECURITY.md. Don't add a form that collects either.

## Design system

The current register is **daylight parchment**: warm paper grounds, plum-black ink,
one burnt-copper accent, hard 12° diagonals, paper grain over everything.

Two token layers coexist in [src/index.css](src/index.css) — use the right one:

- **Raw brand vars** (`--paper`, `--ink`, `--accent-raw`, `--clay`…) exposed as plain
  Tailwind colors: `bg-paper`, `text-ink`, `border-hairline`, `text-copper`.
  **Prefer these** for anything brand-facing.
- **shadcn HSL-channel vars** (`--background`, `--primary`, `--border`…) exposed as
  `bg-background`, `text-foreground`. These exist for shadcn/Radix compatibility.
  Note `border` is pre-multiplied at `/0.16` in [tailwind.config.ts](tailwind.config.ts),
  so `border-border` is already a hairline.

Type is a trio, applied via utility classes, not raw `font-family`:
`.font-serif-display` (Fraunces 490, headlines), `.font-editorial` (Fraunces italic,
body), `.font-display` / `.font-mono-spec` (Barlow Condensed caps, labels + values).

**No slash-counter eyebrows.** The `01 / 02` (and `01 / demo`) index-of-total
labels above section headings are banned by the owner (2026-08-12) and were removed
site-wide — never reintroduce them on new sections. Plain numerals as markers inside
genuinely numbered lists (the feature lists, the homepage approach grid) are fine.

Motion timings are canonical in
[src/components/motion/timing.ts](src/components/motion/timing.ts) — import `MOTION`,
never hardcode a duration or stagger. Reduced motion is handled globally in
index.css *and* per-hook in [src/hooks/useScrollMotion.ts](src/hooks/useScrollMotion.ts);
any new animation must respect it.

## Conventions

- `@/` aliases `./src` (vite + vitest + tsconfig all agree).
- [src/components/ui/](src/components/ui) is generated shadcn/ui. Restyle via tokens
  and variants; avoid rewriting these files by hand unless the change is deliberate.
- **TypeScript strictness is off** (`strict: false`, `noImplicitAny: false`,
  `no-unused-vars` disabled). ESLint's `react-hooks` rules are the real safety net —
  a PostToolUse hook runs it on every edited file.
- Tests: Vitest + Testing Library + jsdom, `src/**/*.{test,spec}.{ts,tsx}`. Coverage is
  currently one placeholder test — new logic in `src/lib/` deserves a real one.
- Two git remotes: `entropia` (canonical) and `origin`. Check which one you mean
  before pushing.
