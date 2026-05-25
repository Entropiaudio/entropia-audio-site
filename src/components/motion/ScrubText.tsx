import { CSSProperties } from "react";
import { useScrubProgress } from "@/hooks/useScrollMotion";
import { cn } from "@/lib/utils";

interface ScrubTextProps {
  children: string;
  className?: string;
  /** Style applied to each word span. */
  wordClassName?: string;
  /** Inline style for the wrapper. */
  style?: CSSProperties;
}

/**
 * Word-by-word opacity scrub keyed to the element's progress through the viewport.
 * Words tween from 0.18 to 1.0 sequentially as the user scrolls past.
 */
const ScrubText = ({
  children,
  className,
  wordClassName,
  style,
}: ScrubTextProps) => {
  const { ref, progress } = useScrubProgress<HTMLParagraphElement>();
  const words = children.split(/(\s+)/);

  // count real words for staging
  const wordCount = words.filter((w) => w.trim().length > 0).length;

  let wordIdx = -1;
  return (
    <p ref={ref} className={cn(className)} style={style}>
      {words.map((w, i) => {
        if (w.trim().length === 0) {
          return <span key={i}>{w}</span>;
        }
        wordIdx++;
        // each word's "center" at i / (count - 1); ramp over a small window
        const center = wordCount > 1 ? wordIdx / (wordCount - 1) : 0.5;
        const local = (progress - center * 0.85) / 0.18 + 0.5;
        const reveal = Math.max(0, Math.min(1, local));
        const op = 0.18 + reveal * 0.82;
        return (
          <span
            key={i}
            className={cn("transition-opacity duration-100", wordClassName)}
            style={{ opacity: op }}
          >
            {w}
          </span>
        );
      })}
    </p>
  );
};

export default ScrubText;
