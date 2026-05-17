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
    headlineLine1: "audio tools",
    headlineLine2: "built with intent",
    subline:
      "a boutique studio making audio stuff. the kind that makes your mix shine, or destroys it!",
    featuredEyebrow: "featured",
    aboutEyebrow: "about",
    aboutBlurb:
      "we're two friends who love this. it was always our dream to make our own tools, and now that dream comes true. we hope you like it.",
    aboutLink: "more on us",
  },

  /* -------------------------------------------------------------------------
   * about page  (/about)
   * ------------------------------------------------------------------------- */
  about: {
    eyebrow: "// about",
    headlineLine1: "an introduction",
    headlineLine2: "and a little message from us",
    portraitPlaceholder: "portrait goes here",
    paragraph1:
      "entropia audio is a studio of two. each of us had our own individual journey in the audio world, until we discovered that we had a shared dream: making the tools we wished existed.",
    paragraph2:
      "yeah so thats about it. we have good plugins. try them and unleash the chaos!",
    paragraph3:
      "we handle everything personally, from development to socials. if you have any feedback or questions, hit us up.",
    contactEyebrow: "contact",
    contactSubline: "we read everything. we mostly reply.",
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
    tagline: "every destination, one reverb.",
    shortDescription:
      "a gorgeous reverb that can bring any sound to life. densed and lush, chaosverb can go pretty much anywhere on the mix. it also comes with our unique chaos engine, that can randomize every parameter on the device simultaniasly, on the fly. pretty wierd stuff, folks.",

    saleBadge: "launch sale",

    features: [
      "pristine reverb engine, fine tuned to produce beautiful rooms and halls",
      "chaos engine - any parameter you want can mutate on a synced interval, forever.",
      "spectral and dynamic shaping - compress, eq and saturate your reverb to change its nature and sound.",
      "motion section - chorus and wow/flutter for some extgra interest.",
      "built-in ducker - so your sounds dont drown out.",
    ],

    sections: [
      {
        heading: "from mixing to sound design.",
        body: "back the chaos off and it's a clean, three-dimensional reverb you can put on anything: a pad, a snare, your questionable vocal recordings. push it up and wierd stuff begins to happen, and the sounds you thought you knew begin to spiral out of control. the same plugin across a whole project, doing different jobs.",
      },
      {
        heading: "made with care",
        body: "we built this plugin because we genuinely love this stuff. every parameter and design choice was carefully thought out. it won't save your shitty snare though.",
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

    tryEyebrow: "take it for a test drive",
    tryHeadline: "free for seven days",
    trySubline:
      "a fully featured trial for you to try. why not give it a go?",
    downloadMac: "download for macOS",
    downloadWin: "download for Windows",

    /* sticky CTA bar buttons */
    ctaTry: "try free",
    ctaBuy: "buy",
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
    headlineLine1: "we ship rarely,",
    headlineLine2:
      "when there's something worth saying.",
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
      "hit us up",
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
    tagLine: "unleashing chaos",
  },

  /* -------------------------------------------------------------------------
   * order success page  (/order/:id)
   * ------------------------------------------------------------------------- */
  orderSuccess: {
    eyebrow: "payment received",
    headline: "thanks. your licenses are ready.",
  },

  /* -------------------------------------------------------------------------
   * legal pages  (/legal/eula  and  /legal/privacy)
   *
   * each section becomes a heading + paragraph block.
   * to add or remove sections, add or remove items in the `sections` array.
   * the lastUpdated date shows as a small mono caption under the title.
   * ------------------------------------------------------------------------- */
  legal: {
    eula: {
      eyebrow: "// legal",
      title: "end user license agreement",
      lastUpdated: "last updated: 2026-01-01",
      intro:
        "this is a placeholder. real legal text should replace what's below before launch. nothing here is binding.",
      sections: [
        {
          heading: "1. license grant",
          body:
            "we grant you a non-exclusive, non-transferable license to install and use the software on machines you own, for personal and commercial music production. you do not own the software; you own a license to use it.",
        },
        {
          heading: "2. what you can't do",
          body:
            "no redistributing the installer, sharing your license key, reverse-engineering the binaries, or claiming you made it. one license, one human.",
        },
        {
          heading: "3. updates and support",
          body:
            "you'll get bug fixes and reasonable updates for the version line you bought. we'll answer email when we can. we're a studio of two; please be patient.",
        },
        {
          heading: "4. no warranty",
          body:
            "the software is provided as-is. if it eats your session, we're sorry, but we're not on the hook for lost work. always back up.",
        },
        {
          heading: "5. termination",
          body:
            "violating these terms terminates your license. if it gets to that point we'll send an email first.",
        },
        {
          heading: "6. contact",
          body:
            "questions, edge cases, polite requests — email us and we'll figure it out together.",
        },
      ],
    },
    privacy: {
      eyebrow: "// legal",
      title: "privacy policy",
      lastUpdated: "last updated: 2026-01-01",
      intro:
        "this is a placeholder. real privacy text should replace what's below before launch. nothing here is binding.",
      sections: [
        {
          heading: "1. what we collect",
          body:
            "your email when you buy something, sign up for the mailing list, or write to us. that's it. we don't run analytics that follow you around the web.",
        },
        {
          heading: "2. how we use it",
          body:
            "to send you your licenses, the very occasional product email, and replies to your questions. nothing else.",
        },
        {
          heading: "3. who sees it",
          body:
            "us, and the services we need to run the studio (payments processor, email delivery). we don't sell, rent, or share your data with anyone else.",
        },
        {
          heading: "4. cookies",
          body:
            "we use a small number of strictly necessary cookies — the kind that keeps you logged in and remembers what's in your cart. no tracking cookies.",
        },
        {
          heading: "5. your rights",
          body:
            "ask us to delete your data and we will. ask us what we have on you and we'll tell you. email is fine.",
        },
        {
          heading: "6. contact",
          body:
            "data questions go to the same address as everything else.",
        },
      ],
    },
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
  contactEmail: "contact@entropiaudio.com",
} as const;

export type Copy = typeof copy;
