/* ============================================================================
 * site copy — every word on the website lives here.
 * ============================================================================
 *
 * how to edit:
 *
 *   1. find the section you want to change (home, about, chaosverb, etc.).
 *   2. change the text between the quotes. don't change the keys on the left.
 *   3. save the file. the browser updates automatically.
 *
 * rules:
 *   - everything inside "double quotes" is yours to rewrite.
 *   - DON'T touch the keys (the words before the colon, like  tagline:  ).
 *   - apostrophes are fine: "don't worry about it" works.
 *   - line breaks: in headlines that say `\n`, the `\n` becomes a line break.
 *     remove it for one line, add it where you want a break.
 *   - prices and version numbers are numbers, not text. no quotes around them.
 *   - if you break the file, the browser shows a red error. just fix and save.
 *
 * the only thing NOT in this file:
 *   - the browser tab title and SEO description, which live in `index.html`
 *     at the project root. there's a comment up top there showing where.
 *
 * ============================================================================ */

export const copy = {

  /* -------------------------------------------------------------------------
   * top header (shows on every page)
   * ------------------------------------------------------------------------- */
  header: {
    wordmark: "entropia audio",
    nav: {
      about: "about",
      account: "account",
      cart: "cart",
    },
  },

  /* -------------------------------------------------------------------------
   * homepage  (/)
   * ------------------------------------------------------------------------- */
  home: {
    eyebrow: "// entropia audio",
    headlineLine1: "audio tools,",
    headlineLine2: "built by two nerds who care.",
    subline:
      "a small studio making serious plugins. the kind that sit well on a mix bus, and the kind that pull a held note somewhere it wasn't going.",
    featuredEyebrow: "featured",
    aboutEyebrow: "about",
    aboutBlurb:
      "we're two friends who love this. the dsp, the knobs, the way a reverb tail decays just right. small studio, no committee, no filler. if you have feedback, it lands in our inbox.",
    aboutLink: "more on us",
  },

  /* -------------------------------------------------------------------------
   * about page  (/about)
   * ------------------------------------------------------------------------- */
  about: {
    eyebrow: "// about",
    headlineLine1: "two friends,",
    headlineLine2: "a few good plugins.",
    portraitPlaceholder: "portrait goes here",
    paragraph1:
      "entropia audio is a studio of two. we love this: the dsp, the knobs, the way a reverb tail decays just right. we started building plugins because we wanted to make the tools we wished existed, and because there's something honest about shipping a small thing well.",
    paragraph2:
      "we care about three things, in this order: how it sounds, how it feels to use, how it looks when you open it. we tune knobs by ear. we sweat the typography. we'd rather sit on a release for another week than ship something we don't love.",
    paragraph3:
      "no committee, no filler, no marketing department. if you have feedback (a bug, a feature, a sound you wish the plugin could make), write to us. it lands in our inbox.",
    contactEyebrow: "contact",
    contactSubline: "a real inbox. we read everything. we mostly reply.",
  },

  /* -------------------------------------------------------------------------
   * chaosverb plugin  (/plugins/chaosverb)
   *
   * features: 5 numbered bullets shown big on the product page.
   * sections: 3 alternating image+text blocks, each has a heading and body.
   * demos:    3 audio players. the `slug` is internal id; don't change it.
   * specs:    the technical specifications table.
   * ------------------------------------------------------------------------- */
  chaosverb: {
    name: "chaosverb",
    tagline: "two engines, one reverb.",
    shortDescription:
      "an 8-line FDN reverb that sits beautifully on a mix bus, with a chaos engine for the moments you want it to drift somewhere else entirely.",

    saleBadge: "launch sale",

    features: [
      "8-line feedback delay network. plate-leaning core, room to hall topologies.",
      "chaos engine. parameters mutate on a synced interval, locks pin what you love.",
      "tone section. tilt EQ, low and high cut, tape saturation, tuned 200 Hz damping.",
      "motion section. chorus and wow/flutter for analog drift.",
      "built-in ducker. full BPM sync on pre-delay and mutation interval.",
    ],

    sections: [
      {
        heading: "two engines, one reverb.",
        body: "chaosverb runs two FDN reverbs at once. you pick the interval: every bar, every thirty seconds, never. on each tick, the unlocked parameters randomize and the engine crossfades smoothly to the new state. nothing clicks. nothing jumps. the reverb just becomes something it wasn't a moment ago. lock the knobs you love, let the rest drift.",
      },
      {
        heading: "from mix bus to sound design.",
        body: "back the chaos off and it's a clean, three-dimensional reverb you can put on anything: a vocal, a snare, a full mix bus. push it up and a snare hit becomes a pad, a held vocal becomes an ambient bed, a drum loop becomes a slow-moving cloud. the same plugin across a whole project, doing different jobs.",
      },
      {
        heading: "made by two.",
        body: "we're entropia audio. two friends who love this: the dsp, the knobs, the way a reverb tail decays just right. small studio, no committee, no filler. if you have feedback, it lands in our inbox.",
      },
    ],

    listenEyebrow: "listen",
    listenHeadline: "a few things it can do.",

    demos: [
      {
        slug: "mix-bus",
        title: "on a mix bus.",
        caption:
          "drums and vocal through chaosverb at low chaos. wide, three-dimensional, gets out of the way.",
      },
      {
        slug: "chaos-sweep",
        title: "the chaos engine, sweeping.",
        caption:
          "a sustained synth note with mutation set to one bar. the reverb keeps moving without ever clicking.",
      },
      {
        slug: "drum-to-pad",
        title: "drum hit becomes a pad.",
        caption:
          "single snare hit, long decay, mutation at four bars, mix at 100%. the source disappears into texture.",
      },
    ],

    specsEyebrow: "specifications",
    specs: [
      { label: "Format", value: "VST3 / AU / Standalone" },
      { label: "OS", value: "Windows 10+ / macOS 10.13+ (64-bit)" },
      { label: "Activation", value: "license key, 7-day free trial" },
      { label: "CPU", value: "low. designed to sit on a bus." },
    ],

    tryEyebrow: "try",
    tryHeadline: "the real plugin, free for seven days.",
    trySubline:
      "no noise, no silence. the full thing. enter a license key when you're ready, or don't.",
    downloadMac: "download for macOS",
    downloadWin: "download for Windows",

    /* sticky CTA bar buttons */
    ctaTry: "try free",
    ctaBuy: "buy",
    ctaRent: "rent-to-own",
  },

  /* -------------------------------------------------------------------------
   * homepage product row buttons
   * ------------------------------------------------------------------------- */
  productRow: {
    eyebrow: "01 / plugin",
    primaryButton: "see chaosverb",
    secondaryButton: "try free",
  },

  /* -------------------------------------------------------------------------
   * newsletter section (homepage)
   * ------------------------------------------------------------------------- */
  newsletter: {
    eyebrow: "mailing list",
    headlineLine1: "we ship rarely.",
    headlineLine2:
      "when there's something worth saying, we'll send a short note.",
    placeholder: "your email",
    button: "subscribe",
    successTitle: "subscribed.",
    successDescription:
      "we'll be in touch sparingly, when there's something worth saying.",
    afterSubmit: "// thanks.",
  },

  /* -------------------------------------------------------------------------
   * footer (every page)
   * ------------------------------------------------------------------------- */
  footer: {
    title: "entropia audio",
    blurb:
      "a small studio of two, making serious audio plugins. designed and built with care.",
    siteHeading: "site",
    legalHeading: "legal",
    nav: {
      chaosverb: "chaosverb",
      about: "about",
      account: "account",
      eula: "eula",
      privacy: "privacy",
    },
    copyright: "entropia audio",
    tagLine: "made by two",
  },

  /* -------------------------------------------------------------------------
   * order success page  (/order/:id)
   * ------------------------------------------------------------------------- */
  orderSuccess: {
    eyebrow: "payment received",
    headline: "thanks. your licenses are ready.",
  },

  /* -------------------------------------------------------------------------
   * shared / misc
   * ------------------------------------------------------------------------- */
  shared: {
    addedToCart: (name: string) => `${name} added to cart.`,
  },

  /* -------------------------------------------------------------------------
   * contact email — used in footer + about page
   * ------------------------------------------------------------------------- */
  contactEmail: "entropia.audio@gmail.com",
} as const;

export type Copy = typeof copy;
