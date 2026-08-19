import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabelledSectionProps {
  /** The small caps label in the left margin. */
  label: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Colour for the label. Both tones are readable on every ground the site
   * uses, including tan — the old "deep" copper was 4.3:1 at this size, which
   * is why there is now one copper here instead of two.
   */
  labelTone?: "dim" | "copper";
  /** Extra top padding on the label so it aligns with the first line of copy. */
  labelPad?: string;
  /**
   * The label names the section, so by default it *is* the section heading —
   * small caps in the margin, but an `h2` to everything that reads structure
   * rather than pixels. Pass "div" where the label repeats something the
   * content already says in an `h1`, so the page doesn't open on an h2.
   */
  labelAs?: "h2" | "div";
}

const toneClass = {
  dim: "text-[color:var(--ink-3)]",
  copper: "text-[color:var(--accent-ink)]",
};

/**
 * The page's spine: a small caps label parked in the left margin against a
 * wide content column. Every editorial block on the product, about, and legal
 * pages hangs off this one grid so the labels line up down the whole site.
 * Collapses to a single column below md.
 */
export const LabelledSection = ({
  label,
  children,
  id,
  className,
  style,
  labelTone = "dim",
  labelPad = "6px",
  labelAs = "h2",
}: LabelledSectionProps) => {
  const Label = labelAs;
  return (
    <section
      id={id}
      className={cn(
        "relative grid gap-8 md:gap-[34px] px-[3.2vw] md:grid-cols-[minmax(120px,1fr)_minmax(0,3.2fr)]",
        className,
      )}
      style={style}
    >
      <Label
        className={cn(
          "font-mono font-semibold text-fluid-10 uppercase tracking-[0.2em] m-0",
          toneClass[labelTone],
        )}
        style={{ paddingTop: labelPad }}
      >
        {label}
      </Label>
      <div>{children}</div>
    </section>
  );
};

export default LabelledSection;
