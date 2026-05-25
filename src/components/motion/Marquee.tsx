import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Seconds for a full loop. Larger = slower. */
  duration?: number;
  className?: string;
  /** Direction of travel. */
  direction?: "left" | "right";
  /** Optional separator rendered between items. */
  separator?: ReactNode;
}

/**
 * Infinite editorial marquee. Duplicates the content so the loop is seamless.
 * Honors prefers-reduced-motion via CSS animation-duration override.
 */
const Marquee = ({
  items,
  duration = 60,
  className,
  direction = "left",
  separator,
}: MarqueeProps) => {
  const sep =
    separator ?? (
      <span
        aria-hidden="true"
        className="mx-10 inline-block h-[6px] w-[6px] translate-y-[-0.45em] rounded-full bg-[color:var(--accent-raw)] opacity-70"
      />
    );

  const renderRow = (key: string) => (
    <div
      key={key}
      className="flex shrink-0 items-baseline whitespace-nowrap"
      aria-hidden={key === "b"}
    >
      {items.map((it, i) => (
        <span key={`${key}-${i}`} className="inline-flex items-baseline">
          <span>{it}</span>
          {sep}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "marquee-mask relative w-full overflow-hidden",
        className,
      )}
    >
      <div
        className="flex w-max items-baseline"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {renderRow("a")}
        {renderRow("b")}
      </div>
    </div>
  );
};

export default Marquee;
