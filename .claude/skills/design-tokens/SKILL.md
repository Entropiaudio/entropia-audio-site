---
name: design-tokens
description: The entropia audio design system — colour, type, motion, and the diagonal/grain motifs. Read before writing or restyling any component, or when a change involves colours, fonts, shadows, spacing, or animation timing.
user-invocable: false
---

# entropia design tokens

Current register: **daylight parchment**. Warm paper grounds, plum-black ink, one
burnt-copper accent, hard 12° diagonals, paper grain over every surface. There is no
dark mode for the site chrome — the only dark surface is `plugin-surface`, reserved for
plugin screenshots.

Everything below is defined in [src/index.css](../../../src/index.css) (`:root`, ~87
custom properties) and exposed to Tailwind in
[tailwind.config.ts](../../../tailwind.config.ts).

## The one rule

**No raw hex, rgb, or hsl values in components.** If you're reaching for `#F2E1C7` or
`rgba(42,23,30,0.5)`, there is already a token for it. Use the Tailwind class; drop to
`var(--token)` only when you need an exact value inside a gradient, `clip-path`, or
`box-shadow` that Tailwind can't express.

## Two token layers

Both are live. Pick deliberately.

### 1. Raw brand tokens — prefer these

Plain CSS values, mapped to Tailwind colour names directly.

| Token | Class | Value | Use for |
|---|---|---|---|
| `--paper` | `bg-paper` | `#F2E1C7` | the default page ground |
| `--parchment` | `bg-parchment` | `#F6E6CF` | cards, raised surfaces |
| `--parchment-hi` | `bg-parchment-hi` | `#FAEDDA` | popovers, the highest surface |
| `--field` | `bg-field` | `#ECD9BD` | inset fields: inputs, tracks, meters |
| `--tan` / `--clay` / `--umber` | `bg-tan` … | `#E2C5A1` / `#C59D74` / `#9A6A45` | banded sections, warm blocks |
| `--ink` | `text-ink` | `#2A171E` | primary type + line |
| `--ink-2/3/4` | `text-ink-2` … | ink at 80% / 68% / 32% | secondary, tertiary, faintest |
| `--accent-raw` | `text-copper` `bg-copper` | `#C25A1E` | the single accent — hover, focus, emphasis |
| `--pop` | `text-pop` | `#F14E71` | the collage pink. One loud moment per page, max. |

Also raw, no Tailwind class — use `var(--…)`: `--ink-line` (0.16) and `--ink-line-2`
(0.30) for hairlines, `--accent-bright` / `--accent-deep` / `--accent-ink` (the
default copper for type below 24px) / `--accent-tint` / `--accent-muted`, `--plum`,
`--plum-block` (the footer wedge).

**Product signature hues** (raw, no Tailwind class): each plugin's own colour,
sampled from its UI, coding the *product* wherever it appears — card tagline, solid
status chip, feature numerals, demo transport, the hero stain, and one
headline-scale moment per page (the preview pages' h1; Chaosverb's listen headline). Copper
remains the only *action* accent. Chaosverb: `--chaosverb-blue` `#4E7A8A` / `--chaosverb-blue-ink`
`#2C5260` / `--chaosverb-blue-tint`. Fiction: `--fiction-violet` `#8A5A7E` /
`--fiction-violet-ink` `#6C405F` (formerly `--section-motion`) /
`--fiction-violet-tint`. Entropan: `--entropan-olive` `#6E7738` /
`--entropan-olive-ink` `#4A5226` / `--entropan-olive-tint`. The `*-ink` step is the
only one that may carry type below 24px (≥5:1 on tan, matching `--accent-ink`); the
base step is for rules and arcs (the blue and olive bases clear 3:1 on paper only —
2.9:1 on tan, so keep those marks off the tan band); tints are washes. Components reach these through `plugin.accent` / `plugin.accentWash`
([src/data/plugins.ts](../../../src/data/plugins.ts)) rather than naming a product's
token directly.

States, warmed for paper: `--state-success` `#3E9A5E`, `--state-warning` `#C98A32`,
`--state-error` `#C24A3A`, `--action-create` `#1F8F6B`.

### 2. shadcn HSL-channel tokens — compatibility only

`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--border`,
`--ring`… are stored as bare HSL channels (`36 62% 87%`) and wrapped as
`hsl(var(--x))` in the Tailwind config. They exist so the 49 generated components in
`src/components/ui/` keep working. Two gotchas:

- **`border` and `input` are pre-multiplied with alpha** in tailwind.config.ts
  (`hsl(var(--border) / 0.16)`). `border-border` is *already* a hairline — don't stack
  another opacity on it.
- `--primary` is **ink**, not copper. The solid CTA is an ink fill that warms to copper
  on hover.

## Type — a trio, applied by utility class

Never set `font-family` directly. Self-hosted from `public/fonts`.

| Class | Face | Voice |
|---|---|---|
| `.font-serif-display` | Fraunces 490, `-0.012em`, `text-wrap: balance` | headlines: "Entropia Audio", "The plugins" |
| `.font-editorial` | Fraunces 400, usually italic | editorial body copy |
| `.font-serif-caps` | Fraunces 500 caps, `+0.04em` | serif companion in display lockups |
| `.font-display` | Barlow Condensed 600 caps, `+0.02em` | giant-caps brand voice |
| `.font-mono-spec` | Barlow Condensed 400 | labels, values, keys, spec tables |

Barlow Condensed ships as a **single 300 master** — heavier weights render as faux-bold
deliberately. Measure helpers: `.measure` (62ch), `.measure-tight` (48ch), or
`max-w-measure` / `max-w-editorial` (920px).

### The fluid reading scale (big screens)

Small type rides one unit, `--fpx` (index.css): exactly 1px up to a 1440px viewport,
widening linearly to 1.2px at 2560px, frozen past that. The `text-fluid-N` sizes in
tailwind.config.ts are multiples of it — `text-fluid-15` is 15px on a laptop, 18px on
a 27" monitor. Because every voice scales by the same factor, the hierarchy between
sizes never shifts.

- **Content type takes `text-fluid-N`**, never a raw `text-[Npx]` — a fixed size is
  how the site ended up unreadably small on wide monitors.
- **Chrome stays fixed px on purpose**: header/footer nav, buttons, the `.chip`
  component, the buy strip. Controls don't need to grow with the monitor. (The
  in-card status chip on PluginCard is content, not chrome — it rides the scale
  with its card, box included: `px-[calc(8*var(--fpx))]`.)
- **Headlines don't ride `--fpx`** — they carry their own `clamp(…vw…)` and their caps
  are paired with whatever image or frame they sit against.
- The homepage hero is the exception to headline caps: its type is composed *into* the
  painting, so all its clamps share the painting's vw scale with caps landing together
  near 3440w (see the comment in Index.tsx). Don't re-cap it at laptop width.
- A box sized to fit fluid text scales with it: `w-[calc(88*var(--fpx))]` (the demo
  transport's time readout does this).
- `cn()`/tailwind-merge knows `text-fluid-*` is a font-size via the extended config in
  [src/lib/utils.ts](../../../src/lib/utils.ts) — without that entry it reads the class
  as a text *colour* and silently drops it on merge.

Image/text spreads carry a frame cap for the same reason from the other side: the
story rows (PluginPage, PluginPreview) and team rows (About) grid inside `max-w-spread
mx-auto` (1320px, tailwind.config.ts), so their shots stop at ~640px — under the
1040px hero plate, sharp at 2x from the ~1250px exports — instead of outgrowing
both the plate and the paragraph beside them.

## Motion

- Timings are canonical in
  [src/components/motion/timing.ts](../../../src/components/motion/timing.ts). Import
  `MOTION` — `MOTION.duration.base` (320ms), `.headline` (420), `.image` (700),
  `.instant` (160); `MOTION.stagger.word` (45) / `.body` (70) / `.list` (60);
  `MOTION.page.*` for above-the-fold delays, `MOTION.section.*` for
  IntersectionObserver-triggered sections. **Never hardcode a duration.**
- Section rhythm when adding a new one:
  eyebrow → headline1 → headline2 → body[0..2] → cta.
- Easing is one curve: `cubic-bezier(0.22, 1, 0.36, 1)` — `var(--ease-editorial)`,
  `.ease-editorial`, or Tailwind's `ease-editorial`.
- CSS transition scale: `--t-fast` 120ms, `--t-base` 200ms, `--t-slow` 350ms.
- **Reduced motion is non-negotiable.** index.css kills animation globally under
  `prefers-reduced-motion: reduce`, and
  [src/hooks/useScrollMotion.ts](../../../src/hooks/useScrollMotion.ts) checks it per
  hook. Any JS-driven animation (scroll transforms, magnetic hover, tickers) must check
  it too — the global CSS rule will not stop a `requestAnimationFrame` loop.

## Motifs

**The 12° diagonal** (from the logo's slice gaps) is the brand's structural gesture.
`--pitch: 12deg`. Helpers: `.diag-cut-bottom` / `.diag-cut-top` (edge cuts, tune with
`--cut`), `.diag-band-top` (section separation, tune with `--rise`), `.corner-cut`
(sliced top-right on cards), `.hatch-copper` (and `--hatch-umber` / `--hatch-column`).

**Dividers are fades, never hard lines.** `.rule-fade`, `.rule-top-fade`,
`.rule-bottom-fade` — all driven by `--divider-fade`.

**Paper grain** sits over everything via `--grain-img` (an inline SVG turbulence tile),
`--grain-scale` 230px, `--grain-amt` 0.09. Rendered by
[src/components/motion/Grain.tsx](../../../src/components/motion/Grain.tsx); a surface
that needs its own multiply pass can reference the tile directly.

**Shadows are warm plum ink, never flat black** — `--shadow-card`, `--shadow-lift`,
`--shadow-ink`, or Tailwind `shadow-card` / `shadow-lift` / `shadow-ink`.

## Buttons

Component classes in the `@layer components` block, built on **fixed heights, not
padding**: `.btn-sm` 22px (plugin-control scale), `.btn-md` 34px (default), `.btn-lg`
42px. Variants: `.btn-solid` (ink fill → copper on hover, the primary CTA), `.btn-ghost`
(white pill on parchment, nav + secondary), `.btn-pill` (outline only, the technical
control). Related: `.chip`, `.field-ink`, `.nav-link`, `.link-ink`, `.link-draw`,
`.hero-cta`.

Radius scale: buttons 4–6px, surfaces 8–12px (`rounded-sm/DEFAULT/md/lg` = 4/6/8/12).

## Accessibility invariants

- Focus is `1px solid var(--accent-raw)` at `3px` offset, applied globally to
  `:focus-visible`. Don't remove outlines locally.
- Body text is **unselectable by design** (editorial feel). Inputs, `code`, `pre`, and
  anything marked `.selectable` opt back in. If you add a surface with content a user
  needs to copy — a licence key, an error code, a price — mark it `.selectable`.
- Contrast: the ink ramp is tuned so every step that carries type clears 4.5:1 on the
  darkest ground type ever sits on (`--tan`): `--ink-2` measures 6.4:1 on tan / 7.6:1
  on paper, `--ink-3` 4.6:1 / 5.2:1. `--ink-4` (32%, ~2:1) is the one step below the
  line — hairline ticks, ornament, disabled marks only, never type at any size.

## Known drift

`--shadow-card/lift/ink` in index.css use ink `rgba(42,23,30,…)` while the Tailwind
`boxShadow` entries use `rgba(38,16,25,…)`. Visually near-identical, but they are not
the same value — if you touch either, align both rather than adding a third.
