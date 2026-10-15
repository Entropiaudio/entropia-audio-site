import { CSSProperties, SyntheticEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { MOTION } from "@/components/motion/timing";

/**
 * A plugin UI screenshot as a printed object: hairline frame, soft radius,
 * warm ink shadow. Every screenshot on the site goes through here, so the two
 * products are framed identically on every page.
 *
 * Why it can crop. Raw UI exports used to carry a dirty ring in their
 * outermost pixels — the plugin window's own rounded corner and border,
 * flattened against a dark background on export — and EDGE_CROP trimmed it in
 * SOURCE pixels so the same ring vanished at 1920 and on a phone. The current
 * exports (2026-08, the 2x set) are pre-cleaned: the ring is cropped off in
 * the files themselves, so EDGE_CROP sits at 0 and the frame shows the file
 * edge to edge. If a future re-export ships with a dirty ring again, either
 * clean it at the source (preferred) or raise EDGE_CROP to cover it.
 *
 * Declaring the natural size in plugins.ts still matters: it lets the frame
 * reserve its exact box before the image loads, so nothing jumps.
 *
 * Skins. A plate can hold other renderings of the same UI (`alternates`, the
 * plugin's other skin, same pixel size). They mount hidden once `src` has
 * painted — the hero's first paint never waits on them — so flipping `src` to
 * one of them is a crossfade with nothing left to download: the incoming
 * layer fades in on top, the outgoing one drops away after it lands.
 */

/** Source pixels trimmed from every edge. 0 — the exports are pre-cleaned. */
const EDGE_CROP = 0;

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
  /**
   * Other renderings of this shot at the same pixel size (the plugin's other
   * skin). Preloaded behind `src`; set `src` to one of them to crossfade.
   */
  alternates?: readonly string[];
  /** how far off the page it sits: the big plate, or a story row */
  elevation?: keyof typeof SHADOW;
  className?: string;
  priority?: boolean;
}

export const PluginShot = ({
  src,
  alt,
  size,
  alternates,
  elevation = "row",
  className,
  priority = false,
}: PluginShotProps) => {
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);
  // a declared size always wins; the measurement is the fallback path
  const natural = size ?? measured;

  // Every source this frame has shown or preloaded, in first-seen order. It
  // only grows, so a layer is never torn down and re-fetched mid-flip. (A
  // different shot entirely — another product — wants a fresh frame: callers
  // key the plate by product.)
  const [painted, setPainted] = useState(false);
  const [layers, setLayers] = useState<string[]>([src]);
  const wanted = painted ? [src, ...(alternates ?? [])] : [src];
  const missing = wanted.filter((s) => !layers.includes(s));
  if (missing.length) setLayers([...layers, ...missing]);

  const frameStyle: CSSProperties = {
    // only ever visible in the moment before the image paints
    background: "linear-gradient(120deg, var(--parchment-hi), var(--tan))",
    boxShadow: SHADOW[elevation],
  };
  if (natural) {
    frameStyle.aspectRatio = `${natural.w - EDGE_CROP * 2} / ${natural.h - EDGE_CROP * 2}`;
  }

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setPainted(true);
    if (size || measured) return;
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
      {layers.map((layer, i) => {
        const active = layer === src;
        const first = i === 0;
        return (
          <img
            key={layer}
            src={layer}
            alt={active ? alt : ""}
            aria-hidden={active ? undefined : true}
            // alternates only mount after the first paint, so they load now
            loading={priority || !first ? "eager" : "lazy"}
            // React 18 has no camelCase fetchPriority prop (that's React 19);
            // the lowercase spread passes it through as a plain DOM attribute.
            {...(priority && first ? { fetchpriority: "high" } : null)}
            decoding="async"
            onLoad={onLoad}
            className={cn(
              "block",
              natural ? "absolute max-w-none" : first ? "w-full" : "absolute inset-0 w-full h-full",
            )}
            style={{
              ...imgStyle,
              // the incoming layer fades in on top; the outgoing one waits
              // under it and only drops once the fade has landed, so the
              // frame's parchment never shows through mid-flip
              opacity: active ? 1 : 0,
              zIndex: active ? 1 : 0,
              transition: active
                ? `opacity ${MOTION.duration.base}ms var(--ease-editorial)`
                : `opacity 0s linear ${MOTION.duration.base}ms`,
            }}
          />
        );
      })}
    </div>
  );
};

export default PluginShot;
