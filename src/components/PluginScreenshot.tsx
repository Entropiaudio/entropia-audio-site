type Props = {
  name: string;
  className?: string;
  ratio?: "wide" | "square" | "hero";
  /** When true, render minimal — no labels — useful for grid contexts. */
  bare?: boolean;
};

/**
 * Placeholder for the real Chaosverb screenshot. Sits in a hairline frame
 * on the warm paper background so it reads like a print object. Real PNGs
 * land in /public/screenshots/ and replace this in PluginScreenshotImage.
 */
const PluginScreenshot = ({
  name,
  className = "",
  ratio = "wide",
  bare = false,
}: Props) => {
  const aspect =
    ratio === "wide"
      ? "aspect-[16/9]"
      : ratio === "hero"
      ? "aspect-[2/1]"
      : "aspect-square";

  return (
    <figure
      className={`${aspect} w-full relative ${className}`}
      aria-label={`${name} plugin interface`}
    >
      {/* hairline frame, no shadow — sit it like a gallery object */}
      <div className="absolute inset-0 border border-foreground/15" />

      {/* dark surface stand-in for the actual plugin UI */}
      <div className="absolute inset-[1px] bg-plugin-surface text-plugin-surface-foreground relative overflow-hidden">
        {/* extremely faint grid for "object" feel */}
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
