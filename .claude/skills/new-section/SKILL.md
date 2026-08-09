---
name: new-section
description: Scaffold a new page section in the entropia daylight register — correct ground, diagonal separation, token-driven type, and the canonical reveal rhythm. Use when adding a section or band to any page.
disable-model-invocation: true
---

# new-section

Sections here are rule-bound: a ground, an optional 12° separation from the ground
above, the type trio, and a fixed entrance rhythm. This is the shape to copy.

Before writing, read the `design-tokens` skill for the token layers, and put the copy in
[src/copy.ts](../../../src/copy.ts) — never inline it.

## 1. Pick the ground

| Ground | When | How |
|---|---|---|
| paper (default) | most sections | no background — the page ground shows through |
| `var(--tan)` | a band that needs to separate, e.g. the contact/approach bands | set `background` + `diag-band-top` |
| `var(--parchment)` | raised card-like surfaces | `bg-parchment` |
| `var(--plum-block)` | the footer wedge only | handled by `SiteLayout plum` |

Consecutive sections on the same ground separate with a hairline
(`border-t border-hairline`), not a hard rule.

## 2. Pick the frame

**`LabelledSection`** is the page's spine — a small-caps label in the left margin
against a wide content column. Every editorial block on the product, about, and legal
pages hangs off it so the labels line up down the whole site. Use it unless you have a
reason not to.

```tsx
<LabelledSection label={c.eyebrow} labelTone="dim">
  {/* content */}
</LabelledSection>
```

`labelTone`: `dim` on paper, `deep` on the tan bands (copper-deep reads better there),
`accent` sparingly. `labelPad` nudges the label onto the first line of copy.

A plain `<section className="relative px-[3.2vw] pt-… pb-…">` is right for full-bleed
art and grids that shouldn't inherit the spine.

## 3. The reveal rhythm

Import `MOTION` — never hardcode a duration or delay.

- **Above the fold** → `MOTION.page.*` (`eyebrow`, `headline1`, `headline2`, `body0..2`,
  `cta`), which carry page-start delays.
- **Below the fold** → `MOTION.section.*`, which start at 0 because the
  IntersectionObserver fires as the section scrolls in.

Order is always: eyebrow → headline1 → headline2 → body[0..2] → cta.

`RevealWords` cascades a headline word by word (`stagger={MOTION.stagger.word}`);
`Reveal` moves a whole block (`variant="up"`, or `"wipe"` for imagery). Stagger a list
with `delay={i * MOTION.stagger.body}`.

## 4. Template

A tan band with a diagonal top edge, the spine, and the full rhythm:

```tsx
import LabelledSection from "@/components/primitives/LabelledSection";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import { MOTION } from "@/components/motion/timing";
import { copy } from "@/copy";

const c = copy.home.yourSection;

<div
  className="relative diag-band-top"
  style={{
    background: "var(--tan)",
    paddingTop: "calc(3vw + 64px)",  // clears the diagonal rise
    paddingBottom: "110px",
  }}
>
  <LabelledSection label={c.eyebrow} labelTone="deep" labelPad="14px">
    <h2 className="m-0 max-w-[940px]">
      <RevealWords
        as="span"
        className="block font-serif-display text-[clamp(32px,5vw,64px)] leading-[1.02] text-[color:var(--ink)]"
        {...MOTION.section.headline}
        stagger={MOTION.stagger.word}
      >
        {c.headline}
      </RevealWords>
    </h2>

    <div className="flex flex-col gap-5 mt-8 measure">
      {[c.paragraph1, c.paragraph2].map((p, i) => (
        <Reveal
          key={i}
          variant="up"
          duration={MOTION.duration.base}
          delay={i * MOTION.stagger.body}
        >
          <p className="font-mono text-[15.5px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] m-0">
            {p}
          </p>
        </Reveal>
      ))}
    </div>

    <Reveal variant="up" {...MOTION.section.cta}>
      <a href="#" className="btn btn-md btn-solid mt-10">{c.cta}</a>
    </Reveal>
  </LabelledSection>
</div>
```

On paper, drop the wrapper `<div>` and put the padding on `LabelledSection` via
`className="pt-[84px] pb-14"`.

## 5. Before you call it done

- Copy is in `src/copy.ts`, keys nested under the page — nothing inline.
- No raw hex. Colours come through `var(--…)` or a token class.
- No hardcoded durations. Every timing came from `MOTION`.
- Headline uses `.font-serif-display`; body uses `.font-mono` or `.font-editorial`;
  labels use the small-caps `font-mono` treatment `LabelledSection` already applies.
- Long copy is measure-constrained (`.measure`, `max-w-measure`).
- If the section holds anything a user must copy — a licence key, a price, an error
  code — it's marked `.selectable`; body text is globally unselectable by design.
- Any JS-driven motion checks `prefers-reduced-motion` (see `useScrollMotion`); the
  global CSS rule won't stop a rAF loop.
- If the section sits on a tan band, `labelTone="deep"`.

Run the `design-reviewer` agent over the diff when the section is substantial.
