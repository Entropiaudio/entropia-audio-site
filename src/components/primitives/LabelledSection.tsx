import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabelledSectionProps {
  /** The small caps label in the left margin. */
  label: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Colour for the label — copper-deep reads better on the tan bands. */
  labelTone?: "dim" | "deep" | "accent";
  /** Extra top padding on the label so it aligns with the first line of copy. */
  labelPad?: string;
}

const toneClass = {
  dim: "text-[color:var(--ink-3)]",
  deep: "text-[color:var(--accent-deep)]",
  accent: "text-[color:var(--accent-raw)]",
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
}: LabelledSectionProps) => (
  <section
    id={id}
    className={cn(
      "relative grid gap-8 md:gap-[34px] px-[3.2vw] md:grid-cols-[minmax(120px,1fr)_minmax(0,3.2fr)]",
      className,
    )}
    style={style}
  >
    <div
      className={cn(
        "font-mono font-semibold text-[10px] uppercase tracking-[0.2em]",
        toneClass[labelTone],
      )}
      style={{ paddingTop: labelPad }}
    >
      {label}
    </div>
    <div>{children}</div>
  </section>
);

export default LabelledSection;
