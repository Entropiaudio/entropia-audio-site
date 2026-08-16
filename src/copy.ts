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
 * finding the placeholder text:
 *   - any block marked  DRAFT  was written by an assistant as scaffolding,
 *     not by us. search this file for "DRAFT" to find every one, rewrite the
 *     text in your own voice, then delete that DRAFT line.
 *
 * the only thing NOT in this file:
 *   - the site's default tab title and SEO description, which live in
 *     `index.html` at the project root. there's a comment up top there showing
 *     where. (the per-page tab titles ARE here, under `tabTitles` below.)
 *
 * ============================================================================ */

export const copy = {

  /* -------------------------------------------------------------------------
   * browser tab titles, one per page
   *
   * what shows in the browser tab and in google results. each page's name gets
   * the suffix added to it automatically, so "cart" becomes
   * "cart · entropia audio". the homepage keeps the title from index.html.
   * ------------------------------------------------------------------------- */
  tabTitles: {
    suffix: " · entropia audio",
    chaosverb: "Chaosverb, every destination one reverb",
    fiction: "Fiction, spectral gate",
    entropan: "Entropan, spectral auto-panner",
    about: "about",
    cart: "cart",
    checkout: "checkout",
    account: "your account",
    activate: "activate your licence",
    orderSuccess: "order confirmed",
    eula: "licence agreement",
    privacy: "privacy policy",
    notFound: "page not found",
  },

  /* -------------------------------------------------------------------------
   * top header (shows on every page)
   * ------------------------------------------------------------------------- */
  header: {
    wordmark: "Entropia Audio",
    nav: {
      /* the products, linked from every page */
      chaosverb: "Chaosverb",
      fiction: "Fiction",
      entropan: "Entropan",
      about: "about",
      account: "account",
      cart: "cart",
    },
  },

  /* -------------------------------------------------------------------------
   * homepage  (/)
   * ------------------------------------------------------------------------- */
  home: {
    /* the painted hero */
    headline: "Entropia Audio",
    subline: "Precisely Chaotic",
    heroCta: "Explore plugins",

    /* the plugin grid */
    pluginsHeadline: "The plugins",
  },

  /* -------------------------------------------------------------------------
   * about page  (/about)
   *
   * the page reads top to bottom: headline → the message → the two of you
   * (a photo and a story each) → the closing block → contact.
   * ------------------------------------------------------------------------- */
  about: {
    headlineLine1: "an introduction",
    headlineLine2: "and a little message from us",

    /* the opening paragraph, set large and italic. want a plain follow-up
       under it? add a `paragraph: "your text"` line right after `lede` and
       the page shows it; leave it out and it doesn't. */
    lede: "entropia audio is a studio of two. each of us had our own individual journey in the audio world, until we discovered that we had a shared dream: making the tools we wished existed.",

    /* the two of you, at full story scale. each entry: the small label over
       the name, the name itself, one italic line, then the story — every
       string in `story` is its own paragraph, add or remove as you like.
       photos: public/team/evyatar.jpg and public/team/noam.jpg — the frames
       find them by first name, any capitalisation. */
    teamHeadline: "the two of us.",
    team: [
      {
        name: "Evyatar Eshel",
        half: "one half",
        story: [
          "Evyatar is an established electronic music producer, DJ, mixing and mastering engineer and a teacher. after almost 10 years in the industry, his journey has led him to geek out about digital audio processing so hard that the only logical next step was to actually do something about it.",
        ],
      },
      {
        name: "Noam Ben Shabat",
        half: "the other half",
        story: [
          "Noam is a renowned mixing and mastering engineer and ambient music producer. with over 15 years in the industry, working on the music of the best-known names in the Israeli pop and electronic music scene, millions of streams and thousands of hours of studio flight time, Noam knows exactly what the person sitting in the studio sweet spot needs.",
        ],
      },
    ],
    /* the portraits' alt text, for screen readers. the name and half slot in
       from the entries above. */
    portraitAlt: (name: string, half: string) => `${name}, ${half} of entropia audio`,

    /* the closing block: a copper stroke, the big serif line, the summation
       paragraph, your signature, and a pointer at the plugins. */
    /* DRAFT — assistant text. rewrite in your voice, keep the key. */
    visionLine: "precise tools for unpredictable music.",
    summation:
      "that's us. we genuinely love this stuff, and we make the plugins we always wanted to use. we handle everything personally, from development to socials. if you have a query or feedback, hit us up.",
    signoff: "- evyatar & noam",
    summationCta: "go try the plugins",

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
        body: "back the chaos off and it's a clean, three-dimensional reverb you can put on anything: a pad, a snare, your questionable vocal recordings. push it up and weird stuff begins to happen, and the sounds you thought you knew begin to spiral out of control. the same plugin across a whole project, doing different jobs.",
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

    /* the homepage card */
    card: {
      status: "v1.0.0",
      tagline: "Every destination, one reverb",
      blurb:
        "a gorgeous reverb that can bring any sound to life - and a chaos engine that can randomize every parameter on the device, on the fly.",
      saleNote: "launch sale",
      primaryButton: "see Chaosverb",
      secondaryButton: "try free",
    },
  },

  /* -------------------------------------------------------------------------
   * fiction plugin  (/plugins/fiction) — not released yet
   *
   * the page mirrors the Chaosverb layout: sticky strip, the interface first,
   * then name + pitch, features, two image/text stories, specifications, and
   * the mailing list where Chaosverb has its trial card. no price and no cart
   * anywhere.
   *
   * features: 4 numbered bullets. stories: 2 image+text blocks. specs: the
   * technical table.
   *
   * optional blocks: a `screenshotCaption: "..."` line under the interface,
   * and a `usesEyebrow: "..."` + `uses: [ {heading, body}, ... ]` grid on a
   * tan band after the stories. they're not in the file right now — add them
   * back and the page shows them again; leave them out and it doesn't.
   * ------------------------------------------------------------------------- */
  fiction: {
    name: "Fiction",
    headline: "make any sound dreamy",
    tagline: "a different story for every signal",
    shortDescription:
      "Fiction features a spectral gate, color pitch quantization effect and a grain delay, all in one. this makes Fiction fit for every kind of sound or mission, from simple cleanups and tone control to complete spectral manipulation.",

    status: "coming soon",
    notifyLink: "get notified",

    featuresEyebrow: "what it does",
    features: [
      "per-frequency gating - every band opens and closes on its own threshold.",
      "sidechain another source to spectrally separate sounds from each other",
      "COLOR engine - make any sound in tune with per frequency pitch quantization",
      "DELAY - use grain delay for some extra glitter and depth",
    ],

    /* the pitch, in longform — two image + text blocks, like Chaosverb's */
    /* DRAFT — assistant text. rewrite in your voice, keep the keys. */
    stories: [
      {
        heading: "the first dynamic tool with a variable threshold",
        body: "the thought that inspired this device was: 'what if I could change the threshold of a spectral dynamic device like I change an eq?'. while FFT spectral processing is not a new concept, changing the user's interaction with the known threshold control opens up a completely new path to gating. from cleanups and natural tone shifts to hipassing and lowpassing with gating and not a filter.",
      },
      {
        heading: "much more than a gate",
        body: "Fiction is built first and foremost as a production and sound design tool. gate controls are tuned that way so that extreme settings produce weird, but satisfying, artifacts. on top of that, fiction includes a color engine and a grain delay, to really tap into that granular and spectral sound signature present in genres like color bass, botanica, petalcore and ambient music.",
      },
    ],

    /* the technical table. DRAFT — the format and OS lines are assumptions
       copied from Chaosverb; correct them before release. */
    specsEyebrow: "specifications",
    specs: [
      { label: "Format", value: "VST3" },
      { label: "OS", value: "Windows 10+ / macOS 10.13+ (64-bit)" },
      { label: "Status", value: "in development" },
    ],

    notifySubline: "first word on Fiction goes to the list.",

    /* the homepage card */
    card: {
      status: "in development",
      tagline: "A Different Story for Every Signal",
      blurb:
        "one of a kind spectral gate, color pitch quantization effect and grain delay, all in one",
      price: "coming soon",
      primaryButton: "preview",
      secondaryButton: "get notified",
    },
  },

  /* -------------------------------------------------------------------------
   * entropan plugin  (/plugins/entropan) — not released yet
   *
   * same page shape as Fiction's: sticky strip, the interface first, then
   * name + pitch, features, two image/text stories, specifications, and the
   * mailing list. no price and no cart anywhere.
   *
   * features: numbered bullets. stories: 2 image+text blocks. specs: the
   * technical table. the same optional blocks as Fiction's work here too
   * (screenshotCaption, usesEyebrow + uses).
   * ------------------------------------------------------------------------- */
  entropan: {
    name: "Entropan",
    headline: "set the stereo field in motion",
    tagline: "movement, band by band",
    shortDescription:
      "Entropan splits your sound into five overlapping bands and gives each one its own panner. every band moves on its own shape, rate, depth and bias, so the low end can hold the middle while the highs drift wide - from gentle widening to full spectral swirl.",

    status: "coming soon",
    notifyLink: "get notified",

    featuresEyebrow: "what it does",
    /* DRAFT — assistant text from the v0.7.0 build. rewrite in your voice,
       keep the keys. */
    features: [
      "five spectral bands - place each one by frequency, Q and lift, then set it moving",
      "six motion shapes per band: sine, triangle, sample & hold, chaos, steps and envelope",
      "a step sequencer with savable patterns, synced to the host or running free",
      "wow, flutter and flux add tape-style drift on top of the panning",
      "serial or parallel routing, per-band solo and bypass, and a global speed over everything",
      "the CHAOS button - randomize the whole device, with undo for when it goes too far",
    ],

    /* the pitch, in longform — two image + text blocks, like Fiction's */
    /* DRAFT — assistant text. rewrite in your voice, keep the keys. */
    stories: [
      {
        heading: "a panner that thinks in bands",
        body: "most auto-panners move the whole signal at once. Entropan splits it into five overlapping bands and moves each one separately - the low end can sit still while the mids sway and the highs wander. every band carries its own rate, depth, stereo bias and gain, right there on the curve, so the motion gets drawn exactly where the sound lives.",
      },
      {
        heading: "six kinds of motion",
        body: "each band picks its own modulator: sine and triangle for classic sweeps, sample & hold and steps for rhythm, chaos for slow unrepeatable drift, envelope to ride the input. patterns save and recall, everything syncs to your session or runs free, and wow, flutter and flux smear a little tape into the result. when you want somewhere new to start, the CHAOS button reshuffles the whole device.",
      },
    ],

    /* the technical table. DRAFT — the format and OS lines are assumptions
       copied from Fiction; correct them before release. */
    specsEyebrow: "specifications",
    specs: [
      { label: "Format", value: "VST3" },
      { label: "OS", value: "Windows 10+ / macOS 10.13+ (64-bit)" },
      { label: "Status", value: "in development" },
    ],

    notifySubline: "first word on Entropan goes to the list.",

    /* the homepage card */
    card: {
      status: "in development",
      tagline: "Movement, Band by Band",
      blurb:
        "a spectral auto-panner - five bands, six motion shapes, tape wow and flutter, from gentle widening to full swirl",
      price: "coming soon",
      primaryButton: "preview",
      secondaryButton: "get notified",
    },
  },

  /* -------------------------------------------------------------------------
   * newsletter section (homepage)
   * ------------------------------------------------------------------------- */
  newsletter: {
    eyebrow: "mailing list",
    headlineLine1: "we ship rarely,",
    headlineLine2:
      "when there's something worth saying.",
    subline: "no schedule, no filler. release notes and the odd new plugin.",
    placeholder: "your email",
    button: "subscribe",
    successTitle: "subscribed.",
    successDescription:
      "we'll be in touch sparingly, when there's something worth saying.",
    /* replaces the form once the address is in */
    successInline: "thanks. we'll be in touch sparingly.",
  },

  /* -------------------------------------------------------------------------
   * account page  (/account)
   *
   * the logged-out side shows sign in / create account; the logged-in side
   * shows one link into the moonbase dashboard, where everything lives.
   * ------------------------------------------------------------------------- */
  account: {
    signInTitle: "sign in",
    signInBody: "access your licenses and downloads.",
    signInCta: "sign in",
    signInSwitch: "no account? create one →",
    signUpTitle: "create account",
    signUpBody: "set up an entropia audio account.",
    signUpCta: "create account",
    signUpSwitch: "already have an account? sign in →",
    signOut: "sign out →",
    /* the single dashboard link */
    /* DRAFT — assistant text. rewrite in your voice, keep the keys. */
    dashboardEyebrow: "licenses, orders & settings",
    dashboardBody:
      "license keys, installers, order history, receipts and account settings live in one moonbase dashboard.",
    dashboardCta: "open your dashboard",
  },

  /* -------------------------------------------------------------------------
   * footer (every page)
   * ------------------------------------------------------------------------- */
  footer: {
    title: "Entropia Audio",
    nav: {
      chaosverb: "Chaosverb",
      fiction: "Fiction",
      entropan: "Entropan",
      about: "about",
      account: "account",
      eula: "eula",
      privacy: "privacy",
    },
    /* the small line centred on the hairline, on every page */
    colophon: "© entropia audio · unleashing chaos",
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
            "Your data is accessible to us and to the third-party services we rely on to operate, principally our storefront and payment provider, Moonbase (moonbase.sh), which processes accounts, orders, and card payments on our behalf. Card details are handled by Moonbase and its payment processor and never touch our servers. We do not sell, rent, or share your data with any other third parties.",
        },
        {
          heading: "4. cookies",
          body:
            "We use strictly necessary cookies to keep our site running, and to remember your cart and login state. We do not use tracking cookies, fingerprinting, or other third-party analytics.",
        },
        {
          heading: "5. your rights",
          body:
            "You have the right to request access to your data, to request a copy of it, and to request that your data be deleted. If you would like to exercise these rights, please email contact@entropiaudio.com and we will respond within 30 days.",
        },
        {
          heading: "6. contact",
          body:
            "If you have any questions about this Privacy Policy or our data practices, please email us at contact@entropiaudio.com.",
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
