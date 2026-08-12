import { CSSProperties, SyntheticEvent, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A plugin UI screenshot as a printed object: hairline frame, soft radius,
 * warm ink shadow. Every screenshot on the site goes through here, so the two
 * products are framed identically on every page.
 *
 * Why it crops. Both UI exports carry a dirty ring in their outermost pixels —
 * the plugin window's own rounded corner and border, flattened against a dark
 * background on export. Measured against an interior luminance of ~225:
 *
 *   chaosverb.webp  edge 72, then 152 / 155 at 1-2px in, clean from 3px
 *   fiction.webp    edge 109, clean from 1px in
 *
 * Rendered straight, that ring reads as a grey smear around the artwork and
 * gets chewed up further by the frame's own radius. So the frame shows the
 * image inset by EDGE_CROP source pixels on every side: the ring is gone, the
 * artwork still reaches the frame's edge, and nothing of the UI is lost.
 *
 * The crop is expressed in SOURCE pixels, not rendered ones, so it trims the
 * same ring at 1920 and on a phone — which is why the natural size has to be
 * declared in plugins.ts. That also lets the frame reserve its exact box
 * before the image loads, so nothing jumps.
 */

/** Source pixels trimmed from every edge. Covers both exports' rings. */
const EDGE_CROP = 3;

/* The hairline frame is an INSET shadow, not a border, and that is load
   bearing: a real border shrinks the img's containing block by 2px, which
   silently ate most of the crop below (and inverted it into a 0.2px parchment
   gap on the smaller story rows). An inset ring costs no layout, so the frame
   box, the aspect-ratio box and the img's containing block are all one thing
   and the arithmetic below is exact. */
const RING = "inset 0 0 0 1px rgba(42,23,30,0.16)";
const SHADOW = {
  hero: `${RING}, 0 18px 40px rgba(42,23,30,0.24)`,
  row: `${RING}, 0 12px 28px rgba(42,23,30,0.20)`,
} as const;

interface PluginShotProps {
  src: string;
  alt: string;
  /**
   * The file's natural pixel size. Declaring it in plugins.ts lets the frame
   * reserve its exact box before the image loads, so nothing jumps. Leave it
   * out and the frame measures the file itself on load — correct either way,
   * just with a hair of reflow the first time. Drop a new screenshot in and it
   * works with no numbers to look up.
   */
  size?: { w: number; h: number };
  /** how far off the page it sits: the big plate, or a story row */
  elevation?: keyof typeof SHADOW;
  className?: string;
  priority?: boolean;
}

export const PluginShot = ({
  src,
  alt,
  size,
  elevation = "row",
  className,
  priority = false,
}: PluginShotProps) => {
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);
  // a declared size always wins; the measurement is the fallback path
  const natural = size ?? measured;

  const frameStyle: CSSProperties = {
    // only ever visible in the moment before the image paints
    background: "linear-gradient(120deg, var(--parchment-hi), var(--tan))",
    boxShadow: SHADOW[elevation],
  };
  if (natural) {
    frameStyle.aspectRatio = `${natural.w - EDGE_CROP * 2} / ${natural.h - EDGE_CROP * 2}`;
  }

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (size) return;
    const el = e.currentTarget;
    if (el.naturalWidth && el.naturalHeight) {
      setMeasured({ w: el.naturalWidth, h: el.naturalHeight });
    }
  };

  // Until the size is known the image lays itself out in normal flow and gives
  // the frame its height; once known it goes absolute and takes the crop.
  const imgStyle: CSSProperties = natural
    ? {
        width: `${(natural.w / (natural.w - EDGE_CROP * 2)) * 100}%`,
        height: `${(natural.h / (natural.h - EDGE_CROP * 2)) * 100}%`,
        left: `${(-EDGE_CROP / (natural.w - EDGE_CROP * 2)) * 100}%`,
        top: `${(-EDGE_CROP / (natural.h - EDGE_CROP * 2)) * 100}%`,
      }
    : {};

  return (
    <div
      className={cn("relative block w-full overflow-hidden rounded-lg", className)}
      style={frameStyle}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={onLoad}
        className={cn("block", natural ? "absolute max-w-none" : "w-full")}
        style={imgStyle}
      />
    </div>
  );
};

export default PluginShot;
