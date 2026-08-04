import { cn } from "@/lib/utils";

interface DiagonalRuleProps {
  /** Vertical anchor inside the (relative, overflow-hidden) parent. */
  top?: string;
  className?: string;
}

/**
 * A single travelling rule crossing the field at the brand pitch (−12°) —
 * the diagonal hairline motif from the logo's slice gaps. Parent must be
 * `relative overflow-hidden`.
 */
export const DiagonalRule = ({ top = "58%", className }: DiagonalRuleProps) => (
  <div
    aria-hidden="true"
    className={cn(
      "absolute left-[-10%] right-[-10%] h-px pointer-events-none opacity-60",
      className,
    )}
    style={{
      top,
      background: "var(--accent-raw)",
      transform: "rotate(-12deg)",
    }}
  />
);

export default DiagonalRule;
