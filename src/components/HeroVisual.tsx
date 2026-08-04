import { cn } from "@/lib/utils";

interface HeroVisualProps {
  className?: string;
  /** Render the brush-stroke flourish artwork (the home hero's painting). */
  art?: boolean;
  /** Clip the bottom edge at the brand diagonal. */
  cut?: boolean;
}

/* Paint flecks sampled from the hero painting — copper heat + plum. */
const FLECKS: Array<{ l: string; t: string; s: number; c: string; o: number }> = [
  { l: "67%", t: "70%", s: 5, c: "var(--accent-raw)", o: 0.8 },
  { l: "71%", t: "40%", s: 3, c: "var(--accent-bright)", o: 0.7 },
  { l: "88%", t: "33%", s: 4, c: "var(--accent-raw)", o: 0.75 },
  { l: "93%", t: "45%", s: 6, c: "var(--plum)", o: 0.5 },
  { l: "90%", t: "63%", s: 3, c: "var(--plum)", o: 0.55 },
  { l: "84%", t: "77%", s: 4, c: "var(--accent-bright)", o: 0.7 },
  { l: "78%", t: "83%", s: 2.5, c: "var(--accent-raw)", o: 0.6 },
  { l: "96%", t: "55%", s: 2, c: "var(--accent-raw)", o: 0.6 },
  { l: "73%", t: "60%", s: 2, c: "var(--plum)", o: 0.5 },
  { l: "86%", t: "51%", s: 3, c: "var(--accent-bright)", o: 0.7 },
  { l: "81%", t: "36%", s: 2, c: "var(--accent-raw)", o: 0.55 },
];

/**
 * The daylight hero field: warm parchment radial sampled from the hero
 * painting, paint flecks, contour hairlines, and (on the home page) the
 * brush-stroke flourish. Pure CSS/SVG — replaces the old canvas flow field.
 */
export const HeroVisual = ({ className, art = true, cut = false }: HeroVisualProps) => (
  <div className={cn("relative w-full h-full", className)} aria-hidden="true">
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        clipPath: cut ? "polygon(0 0, 100% 0, 100% calc(100% - 70px), 0 100%)" : undefined,
        background:
          "radial-gradient(135% 100% at 66% 12%, var(--parchment) 0%, var(--paper) 38%, var(--tan) 74%, var(--clay) 100%)",
      }}
    >
      {/* extra grain inside the field so the gradient reads as paper */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {art && (
        /* pinned to the right edge, vertically centered, big enough that the
           trailing brush strokes sweep past the headline's first letter.
           Wrapper owns the position so the animation can own the transform. */
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[165%] sm:w-[135%] md:w-[118%] max-w-none pointer-events-none">
          <img
            src="/art/hero-flourish.svg"
            alt=""
            className="art-in block w-full h-auto select-none"
            style={{
              filter:
                "drop-shadow(0 9px 18px rgba(38,16,25,0.30)) drop-shadow(0 3px 5px rgba(38,16,25,0.42)) drop-shadow(0 0 36px rgba(221,110,38,0.30))",
            }}
            draggable={false}
          />
        </div>
      )}

      {/* paint flecks */}
      <div className="absolute inset-0 pointer-events-none">
        {FLECKS.map((f, i) => (
          <span
            key={i}
            className="fleck absolute rounded-full"
            style={{
              left: f.l,
              top: f.t,
              width: f.s,
              height: f.s,
              background: f.c,
              ["--fo" as never]: f.o,
              ["--fleck-dur" as never]: `${3.4 + (i % 4) * 0.9}s`,
              ["--fleck-delay" as never]: `${(i % 5) * 0.55}s`,
            }}
          />
        ))}
      </div>

      {/* paper veil at the top so the header + eyebrow sit quiet */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, var(--paper) 0%, rgba(237,224,204,0.15) 34%, rgba(237,224,204,0) 62%)",
        }}
      />
    </div>
  </div>
);

export default HeroVisual;
