/* ============================================================================
 * site copy, every word on the website lives here.
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
    headlineLine1: "chaos,",
    headlineLine2: "built precisely.",
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
    name: "Chaosverb",
    tagline: "every destination, one reverb.",
    shortDescription:
      "a gorgeous reverb that can bring any sound to life. dense and lush, Chaosverb can go pretty much anywhere on the mix. it also comes with our unique chaos engine, that can randomize every parameter on the device simultaneously, on the fly. pretty weird stuff, folks.",

    saleBadge: "launch sale",

    features: [
      "pristine reverb engine, fine tuned to produce beautiful rooms and halls",
      "chaos engine - any parameter you want can mutate on a synced interval, forever.",
      "spectral and dynamic shaping - compress, eq and saturate your reverb to change its nature and sound.",
      "motion section - chorus and wow/flutter for some extra interest.",
      "built-in ducker - so your sounds don't drown out.",
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
        slug: "drums",
        title: "drums.",
        caption:
          "a clean example of a beautiful roomy reverb, to give life and space to the drum bus.",
      },
      {
        slug: "vox",
        title: "vocals.",
        caption:
          "lush, long, dense reverb to make your vocals truly shine, while feeling a tad experimental.",
      },
      {
        slug: "sound-design",
        title: "sound design.",
        caption:
          "listen how the chaos engine can produce really weird results when changing rapidly and pushed to an OTT.",
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
    download: "download",

    /* sticky CTA bar buttons */
    ctaTry: "try free",
    ctaBuy: "buy",
  },

  /* -------------------------------------------------------------------------
   * homepage product row buttons
   * ------------------------------------------------------------------------- */
  productRow: {
    eyebrow: "01 / plugin",
    primaryButton: "see Chaosverb",
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
      chaosverb: "Chaosverb",
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
        "By using entropia audio’s products, you accept this agreement. If you do not accept the agreement, do not use the product.",
      sections: [
        {
          heading: "1. license grant",
          body:
            "We grant you a personal, non-exclusive, non-transferable, royalty-free license to use the software for your own music production, whether for personal or commercial purposes. You may install the software on multiple computers for your own use, provided that the software is used by you and not concurrently by multiple users.",
        },
        {
          heading: "2. ownership and intellectual property",
          body:
            "All plugins, installers, and content remain the sole property of entropia audio. You do not acquire any ownership rights in the software.",
        },
        {
          heading: "3. restrictions",
          body:
            "You may not resell, rent, lease, loan, sublicense, or distribute the software in any way.",
        },
        {
          heading: "4. updates and support",
          body:
            "We will provide bug fixes and reasonable updates for the version line you bought. We will answer emails when we can, but please be patient, we're a small team of two.",
        },
        {
          heading: "5. no warranty",
          body:
            "We do not offer any warranty. The Software is provided 'as is' without warranty of any kind, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. In no event shall we be liable for any damages arising out of the use or inability to use the Software.",
        },
        {
          heading: "6. termination",
          body:
            "We may terminate this agreement immediately if you breach any term. Upon termination, you must stop using the software and delete all copies.",
        },
        {
          heading: "7. contact",
          body:
            "Questions, edge cases, polite requests, email us and we'll figure it out together.",
        },
      ],
    },
    privacy: {
      eyebrow: "// legal",
      title: "privacy policy",
      lastUpdated: "last updated: 2026-01-01",
      intro:
        "We respect your privacy. We do not run analytics that follow you around the web, we don’t use trackers, and we only collect the bare minimum data required to sell you products and send you occasional updates.",
      sections: [
        {
          heading: "1. what we collect",
          body:
            "We only collect the data that is necessary for us to operate. This includes your email address when you purchase a product or sign up for our mailing list. We do not collect any other personal data.",
        },
        {
          heading: "2. how we use it",
          body:
            "We use your data solely to provide you with our products and services. This includes sending you your license keys, providing customer support, and sending you occasional marketing emails about new products or updates. We will never sell, rent, or share your data with any third parties.",
        },
        {
          heading: "3. who sees it",
          body:
            "Your data will only be accessible to us and the third-party services we use to operate our business, such as our payment processor and email service provider. We do not sell, rent, or share your data with any other third parties.",
        },
        {
          heading: "4. cookies",
          body:
            "We use strictly necessary cookies to keep our site running, and to remember your cart and login state. We do not use tracking cookies, fingerprinting, or other third-party analytics.",
        },
        {
          heading: "5. your rights",
          body:
            "You have the right to request access to your data, as well as the right to request that your data be deleted. If you would like to exercise these rights, please contact us at [EMAIL_ADDRESS].",
        },
        {
          heading: "6. contact",
          body:
            "If you have any questions about this Privacy Policy or our data practices, please contact us via email.",
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
   * contact email, used in footer + about page
   * ------------------------------------------------------------------------- */
  contactEmail: "contact@entropiaudio.com",
} as const;

export type Copy = typeof copy;
