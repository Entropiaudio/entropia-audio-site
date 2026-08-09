import { cn } from "@/lib/utils";

/**
 * The site's one marquee, spent deliberately: a slow editorial ticker between
 * hairline rules, small caps drifting past with copper ticks at the brand
 * pitch between entries.
 *
 * The track renders the items twice; the CSS loop travels exactly -50% of the
 * doubled track, so the seam never shows. The second copy is aria-hidden so
 * screen readers hear the list once. Pauses on hover; static under
 * prefers-reduced-motion (ticker-track, index.css).
 */
const TickerRule = ({ items, className }: { items: readonly string[]; className?: string }) => {
  const half = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex items-center shrink-0">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="font-mono font-semibold text-[10px] uppercase tracking-[0.22em] whitespace-nowrap text-[color:var(--ink-3)]">
            {t}
          </span>
          <span
            aria-hidden="true"
            className="inline-block w-[2px] h-[10px] mx-[30px] opacity-70 bg-[color:var(--accent-raw)]"
            style={{ transform: "skewX(-12deg)" }}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("ticker relative overflow-hidden rule-top-fade rule-bottom-fade py-[13px]", className)}>
      <div className="ticker-track">
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
};

export default TickerRule;
