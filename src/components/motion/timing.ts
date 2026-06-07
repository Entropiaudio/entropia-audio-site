/**
 * Canonical motion timings. Every Reveal across the site reads from here so
 * the entrance rhythm stays uniform: same durations, same staggers, same
 * cadence between eyebrow → headline → body → CTA.
 *
 * Rule of thumb when adding a new section:
 *   eyebrow → headline1 → headline2 → body[0] → body[1] → body[2] → cta
 *
 * The `delay` field is the "page start" delay for above-the-fold content;
 * below-the-fold sections always start fresh at delay 0 because the
 * IntersectionObserver fires when each section enters the viewport.
 */
export const MOTION = {
  duration: {
    /** Default content reveal — eyebrows, body copy, list items, CTAs. */
    base: 320,
    /** Section headlines — a little more presence than body copy. */
    headline: 420,
    /** Hero imagery only — the one place a longer reveal is earned. */
    image: 700,
    /** Funnel / utility headlines — a single fast fade, no word cascade. */
    instant: 160,
  },
  stagger: {
    word: 45,
    body: 70,
    list: 60,
  },
  page: {
    eyebrow:    { delay: 0,   duration: 300 },
    headline1:  { delay: 80,  duration: 420 },
    headline2:  { delay: 180, duration: 420 },
    body0:      { delay: 200, duration: 300 },
    body1:      { delay: 280, duration: 300 },
    body2:      { delay: 360, duration: 300 },
    cta:        { delay: 360, duration: 300 },
  },
  /** Entrance for sections revealed mid-scroll (IO fires when in view). */
  section: {
    eyebrow:    { delay: 0,   duration: 300 },
    headline:   { delay: 60,  duration: 420 },
    body:       { delay: 140, duration: 300 },
    image:      { delay: 0,   duration: 700 },
    cta:        { delay: 200, duration: 300 },
  },
} as const;
