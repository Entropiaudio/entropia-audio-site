type Props = {
  name: string;
  className?: string;
  ratio?: "wide" | "square" | "hero";
  /** When true, render minimal, no labels, useful for grid contexts. */
  bare?: boolean;
  /** Optional image source. When provided, renders the real screenshot. */
  src?: string;
  /** Image alt for accessibility. */
  alt?: string;
  /** "contain" preserves full UI (good for hero); "cover" crops (good for grid). */
  fit?: "contain" | "cover";
};

/**
 * Real plugin screenshot when `src` is provided. Otherwise falls back to a
 * hairline-framed placeholder. Sits like a print object on the warm paper bg.
 */
const PluginScreenshot = ({
  name,
  className = "",
  ratio = "wide",
  bare = false,
  src,
  alt,
  fit = "cover",
}: Props) => {
  // Chaosverb screenshot native ratio is ~2.35:1 (2000×850).
  // hero matches it exactly; "wide" leaves a touch of breathing room.
  const aspect =
    ratio === "wide"
      ? "aspect-[20/9]"
      : ratio === "hero"
      ? "aspect-[47/20]"
      : "aspect-square";

  if (src) {
    // When showing the real screenshot, let the image set its own height so
    // there is never a black/letterbox band around it. The hairline frame
    // wraps tight to the actual image bounds.
    return (
      <figure className={`w-full relative ${className}`}>
        <img
          src={src}
          alt={alt ?? `${name} plugin interface`}
          loading="lazy"
          className="block w-full h-auto border border-foreground/15"
        />
      </figure>
    );
  }

  return (
    <figure
      className={`${aspect} w-full relative ${className}`}
      aria-label={`${name} plugin interface`}
    >
      <div className="absolute inset-0 border border-foreground/15" />
      <div className="absolute inset-[1px] bg-plugin-surface text-plugin-surface-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {!bare && (
          <>
            <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-3 text-[10px] font-mono uppercase tracking-[0.25em] text-plugin-surface-foreground/40">
              <span>{name}</span>
              <span>screenshot</span>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-plugin-surface-foreground/30">
                plugin ui drops here
              </span>
              <span className="h-px w-10 bg-accent/70" />
            </div>
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-5 py-3 text-[10px] font-mono uppercase tracking-[0.25em] text-plugin-surface-foreground/30">
              <span>entropia audio</span>
              <span>placeholder</span>
            </div>
          </>
        )}
      </div>
    </figure>
  );
};

export default PluginScreenshot;
