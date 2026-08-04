import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Render the copper accent color. Default is dim ink. */
  accent?: boolean;
  /** Size variant. Default 11px. */
  size?: "sm" | "md";
}

const sizeClass = {
  sm: "text-[10px]",
  md: "text-[11px]",
};

/* The Barlow caps label voice — eyebrows run 0.18em tracking. */
export const Eyebrow = ({
  children,
  accent = false,
  size = "md",
  className,
  ...rest
}: EyebrowProps) => (
  <span
    className={cn(
      "inline-block font-mono font-medium uppercase tracking-eyebrow",
      sizeClass[size],
      accent ? "text-[color:var(--accent-raw)]" : "text-[color:var(--ink-3)]",
      className,
    )}
    {...rest}
  >
    {children}
  </span>
);

export default Eyebrow;
