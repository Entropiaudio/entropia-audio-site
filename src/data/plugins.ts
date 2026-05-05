export type Plugin = {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  price: number;
  regularPrice: number;
  features: string[];
  sections: { heading: string; body: string }[];
  specs: { label: string; value: string }[];
  version: string;
};

export const plugins: Plugin[] = [
  {
    slug: "chaosverb",
    name: "chaosverb",
    tagline: "a studio reverb with a chaos engine inside.",
    shortDescription:
      "a versatile reverb that sits beautifully on a mix bus, with a built-in chaos engine for when you want it to fall apart on purpose.",
    price: 36,
    regularPrice: 50,
    features: [
      "rich, musical reverb tails — plates, halls, rooms, anything in between",
      "a chaos engine for granular smears, frozen textures, and otherworldly tails",
      "tone section with tilt EQ, low/high cut, and tuned 200 Hz damping",
      "motion section with chorus and wow/flutter for analog drift",
      "spectral squash, saturation, and a built-in ducker to glue it into the mix",
    ],
    sections: [
      {
        heading: "two engines. one reverb.",
        body: "chaosverb is built on a hand-tuned feedback delay network for the kind of clean, three-dimensional reverb you actually want on a vocal or a snare. alongside it sits a granular chaos engine — pull it in a little for shimmer and motion, push it further for clouds, freezes, and tails that drift somewhere else entirely. one plugin, two minds, no menu diving.",
      },
      {
        heading: "from mix bus to sound design.",
        body: "back the chaos off and chaosverb behaves like a great-sounding studio reverb — wide, musical, low CPU, easy to sit in a busy session. open it up and the same plugin turns into a sound design tool: pads from drum hits, ambient beds from a single note, textures you didn't know were in there. one plugin you can keep across the whole project.",
      },
      {
        heading: "made by two audio nerds.",
        body: "we're entropia audio — two friends who got tired of plugins that sound the same and look like spreadsheets. we build the tools we wished existed: serious sound, honest pricing, the kind of design and craft we'd want for ourselves. small studio, no committee, no filler. if you have feedback, it lands in our inbox, not a ticket queue.",
      },
    ],
    specs: [
      { label: "Format", value: "VST3 / AU" },
      { label: "OS", value: "Windows 10+ / macOS 10.13+ (64-bit)" },
      { label: "Activation", value: "license key, 7-day free trial" },
      { label: "Version", value: "0.0.7b" },
    ],
    version: "0.0.7b",
  },
];

export const getPlugin = (slug: string) => plugins.find((p) => p.slug === slug);
