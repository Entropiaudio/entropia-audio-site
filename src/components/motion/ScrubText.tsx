import { CSSProperties, useCallback, useMemo, useRef } from "react";
import { useScrollScrub } from "@/hooks/useScrollMotion";
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
 * Word-by-word opacity scrub keyed to the element's progress through the
 * viewport. Words tween from 0.18 to 1.0 sequentially as the user scrolls
 * past. Per-frame work is direct DOM mutation, no React re-renders during
 * scroll.
 */
const ScrubText = ({
  children,
  className,
  wordClassName,
  style,
}: ScrubTextProps) => {
  // Split into words once. `tokens` includes whitespace tokens (rendered as
  // plain spans) and `wordIndices` tracks just the real-word positions so we
  // know the stage centre for each word.
  const { tokens, wordCount } = useMemo(() => {
    const t = children.split(/(\s+)/);
    const count = t.filter((w) => w.trim().length > 0).length;
    return { tokens: t, wordCount: count };
  }, [children]);

  // Each non-whitespace token gets a ref; opacity is written directly here.
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const handleUpdate = useCallback(
    (progress: number) => {
      let wordIdx = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].trim().length === 0) continue;
        wordIdx++;
        const center = wordCount > 1 ? wordIdx / (wordCount - 1) : 0.5;
        // Resolve each word by mid-viewport (not the trailing edge) and keep a
        // 0.45 floor so the copy stays readable even before the scrub reaches
        // it — legibility is never gated on the scroll gesture.
        const local = (progress - center * 0.55) / 0.22 + 0.5;
        const reveal = local < 0 ? 0 : local > 1 ? 1 : local;
        const op = 0.45 + reveal * 0.55;
        const el = wordRefs.current[i];
        if (el) el.style.opacity = op.toFixed(3);
      }
    },
    [tokens, wordCount],
  );

  const ref = useScrollScrub<HTMLParagraphElement>(handleUpdate);

  // Reset the refs array length on every render so removed tokens don't
  // hold stale entries.
  wordRefs.current.length = tokens.length;

  return (
    <p ref={ref} className={cn(className)} style={style}>
      {tokens.map((w, i) => {
        if (w.trim().length === 0) {
          return <span key={i}>{w}</span>;
        }
        return (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className={cn("transition-opacity duration-100", wordClassName)}
            style={{ opacity: 0.45 }}
          >
            {w}
          </span>
        );
      })}
    </p>
  );
};

export default ScrubText;
