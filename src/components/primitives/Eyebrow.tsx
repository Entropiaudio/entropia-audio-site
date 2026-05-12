import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Render the copper accent color. Default is text-tertiary. */
  accent?: boolean;
  /** Size variant. Default 12px. */
  size?: "sm" | "md";
}

const sizeClass = {
  sm: "text-[11px]",
  md: "text-[12px]",
};

export const Eyebrow = ({
  children,
  accent = false,
  size = "md",
  className,
  ...rest
}: EyebrowProps) => (
  <span
    className={cn(
      "inline-block font-sans font-medium uppercase tracking-[0.12em]",
      sizeClass[size],
      accent ? "text-[color:var(--accent-raw)]" : "text-[color:var(--text-tertiary)]",
      className,
    )}
    {...rest}
  >
    {children}
  </span>
);

export default Eyebrow;
