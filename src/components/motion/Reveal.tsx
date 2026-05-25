import { ElementType, HTMLAttributes, ReactNode } from "react";
import { useReveal } from "@/hooks/useScrollMotion";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: ElementType;
  /** Visual variant for the entrance. */
  variant?: "up" | "blur" | "mask";
  /** Animation delay in ms. */
  delay?: number;
  /** Animation duration in ms. */
  duration?: number;
}

/**
 * Wrapper that adds a `data-revealed` attribute when the element enters the
 * viewport. CSS in index.css picks up the attribute to drive the actual motion.
 */
const Reveal = ({
  children,
  as,
  variant = "up",
  delay = 0,
  duration = 900,
  className,
  style,
  ...rest
}: RevealProps) => {
  const Tag = (as ?? "div") as ElementType;
  const ref = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      className={cn("will-change-transform", className)}
      style={{
        ["--reveal-delay" as never]: `${delay}ms`,
        ["--reveal-duration" as never]: `${duration}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
