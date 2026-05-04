export type Plugin = {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  price: number;
  features: string[];
  sections: { heading: string; body: string }[];
  specs: { label: string; value: string }[];
  version: string;
};

export const plugins: Plugin[] = [
  {
    slug: "chaosverb",
    name: "chaosverb",
    tagline: "reverb that loses control.",
    shortDescription:
      "a generative reverb engine for unstable spaces, modulated tails, and accidents worth keeping.",
    price: 79,
    features: [
      "Generate dense, evolving reverb tails from any source",
      "Modulate decay, diffusion, and pitch in real time",
      "Inject controlled chaos with the entropy macro",
      "Freeze, smear, and reverse on the fly",
      "CPU-friendly across full mix sessions",
    ],
    sections: [
      {
        heading: "an engine, not a preset machine.",
        body: "chaosverb models reverberation as a system that drifts. every parameter has a slow internal motion, so two passes of the same source rarely sound identical. the result is a reverb that feels alive without sounding effected.",
      },
      {
        heading: "entropy, on a single knob.",
        body: "the entropy macro routes through diffusion, modulation depth, and tail instability simultaneously. at zero, chaosverb behaves like a clean studio plate. at one, it slowly comes apart. everywhere in between is the interesting part.",
      },
      {
        heading: "built for the mix, not the demo.",
        body: "low CPU draw, true stereo processing, full automation, and tempo sync. designed to sit on a bus across a whole session without complaint.",
      },
    ],
    specs: [
      { label: "Format", value: "VST3 / AU" },
      { label: "OS", value: "macOS 10.13+ / Windows 10+" },
      { label: "Activation", value: "serial number, 2 machines" },
      { label: "Version", value: "1.0.0" },
    ],
    version: "1.0.0",
  },
];

export const getPlugin = (slug: string) => plugins.find((p) => p.slug === slug);
