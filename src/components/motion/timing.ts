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
    base: 900,
    image: 1100,
  },
  stagger: {
    word: 60,
    body: 100,
    list: 80,
  },
  page: {
    eyebrow:    { delay: 0,   duration: 900 },
    headline1:  { delay: 120, duration: 900 },
    headline2:  { delay: 280, duration: 900 },
    body0:      { delay: 440, duration: 900 },
    body1:      { delay: 540, duration: 900 },
    body2:      { delay: 640, duration: 900 },
    cta:        { delay: 740, duration: 900 },
  },
  /** Entrance for sections revealed mid-scroll (IO fires when in view). */
  section: {
    eyebrow:    { delay: 0,   duration: 900 },
    headline:   { delay: 80,  duration: 900 },
    body:       { delay: 180, duration: 900 },
    image:      { delay: 0,   duration: 1100 },
    cta:        { delay: 260, duration: 900 },
  },
} as const;
