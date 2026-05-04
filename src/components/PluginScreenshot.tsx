type Props = {
  name: string;
  className?: string;
  ratio?: "wide" | "square";
};

/**
 * Dark stylized placeholder standing in for a real plugin UI screenshot.
 * Renders the plugin name in monospace with a few faux UI elements.
 */
const PluginScreenshot = ({ name, className = "", ratio = "wide" }: Props) => {
  const aspect = ratio === "wide" ? "aspect-[16/9]" : "aspect-square";

  return (
    <div
      className={`${aspect} w-full bg-plugin-surface text-plugin-surface-foreground relative overflow-hidden ${className}`}
    >
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-plugin-surface-foreground/50">
        <span>entropia audio</span>
        <span>v1.0.0</span>
      </div>

      {/* center name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="font-mono text-2xl md:text-4xl tracking-tight text-plugin-surface-foreground">
          {name}
        </span>
        <span className="h-px w-16 bg-accent" />
      </div>

      {/* bottom faux knobs */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-6 py-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border border-plugin-surface-foreground/30 relative">
              <span
                className="absolute left-1/2 top-1/2 h-2 w-px bg-accent origin-bottom"
                style={{ transform: `translate(-50%, -100%) rotate(${-60 + i * 24}deg)` }}
              />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-plugin-surface-foreground/40">
              {["dry", "wet", "size", "decay", "mod", "chaos"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PluginScreenshot;
