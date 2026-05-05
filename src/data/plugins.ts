export type PluginDemo = {
  slug: string;
  title: string;
  caption: string;
  /** path under /public, e.g. /demos/chaosverb-mixbus.mp3 — empty until file ships */
  src: string;
  /** optional dry track for A/B */
  drySrc?: string;
};

export type Plugin = {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  /** active sale price */
  price: number;
  /** crossed-out regular price; shown as "regular" when greater than price */
  regularPrice: number;
  features: string[];
  sections: { heading: string; body: string }[];
  demos: PluginDemo[];
  specs: { label: string; value: string }[];
  version: string;
};

export const plugins: Plugin[] = [
  {
    slug: "chaosverb",
    name: "chaosverb",
    tagline: "two engines, one reverb.",
    shortDescription:
      "an 8-line FDN reverb that sits beautifully on a mix bus, with a chaos engine for the moments you want it to drift somewhere else entirely.",
    price: 36,
    regularPrice: 50,
    features: [
      "8-line feedback delay network — plate-leaning core, room to hall topologies",
      "chaos engine: parameters mutate on a synced interval, locks pin what you love",
      "tone section — tilt EQ, low/high cut, tape saturation, tuned 200 Hz damping",
      "motion section — chorus and wow/flutter for analog drift",
      "built-in ducker, full BPM-sync on pre-delay and mutation interval",
    ],
    sections: [
      {
        heading: "two engines, one reverb.",
        body: "chaosverb runs two FDN reverbs at once. on whatever interval you set — every bar, every thirty seconds, never — the unlocked parameters randomize and the engine crossfades smoothly to the new state. nothing clicks. nothing jumps. the reverb just becomes something it wasn't a moment ago. lock the knobs you love, let the rest drift.",
      },
      {
        heading: "from mix bus to sound design.",
        body: "back the chaos off and it's a clean, three-dimensional reverb you can put on anything — a vocal, a snare, a full mix bus. push it up and a snare hit becomes a pad, a held vocal becomes an ambient bed, a drum loop becomes a slow-moving cloud. the same plugin across a whole project, doing different jobs.",
      },
      {
        heading: "made by two.",
        body: "we're entropia audio — two friends who love this. the dsp, the knobs, the way a reverb tail decays just right. small studio, no committee, no filler. if you have feedback, it lands in our inbox.",
      },
    ],
    demos: [
      {
        slug: "mix-bus",
        title: "on a mix bus.",
        caption:
          "drums and vocal through chaosverb at low chaos — wide, three-dimensional, gets out of the way.",
        src: "",
        drySrc: "",
      },
      {
        slug: "chaos-sweep",
        title: "the chaos engine, sweeping.",
        caption:
          "a sustained synth note with mutation set to one bar. the reverb keeps moving without ever clicking.",
        src: "",
      },
      {
        slug: "drum-to-pad",
        title: "drum hit becomes a pad.",
        caption:
          "single snare hit, long decay, mutation at four bars, mix at 100%. the source disappears into texture.",
        src: "",
      },
    ],
    specs: [
      { label: "Format", value: "VST3 / AU / Standalone" },
      { label: "OS", value: "Windows 10+ / macOS 10.13+ (64-bit)" },
      { label: "Activation", value: "license key, 7-day free trial" },
      { label: "CPU", value: "low — designed to sit on a bus" },
      { label: "Version", value: "0.0.7b" },
    ],
    version: "0.0.7b",
  },
];

export const getPlugin = (slug: string) => plugins.find((p) => p.slug === slug);
