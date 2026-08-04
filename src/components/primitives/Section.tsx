import { HTMLAttributes, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "default" | "rule-top" | "rule-bottom";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Vertical rhythm size. Default is the spec minimum (128px). */
  pad?: "sm" | "md" | "lg" | "xl";
  tone?: SectionTone;
  as?: ElementType;
}

const padClass = {
  sm: "py-16 md:py-32",
  md: "py-20 md:py-40",
  lg: "py-24 md:py-48",
  xl: "py-28 md:py-64",
};

/* Section rules are faded ink hairlines — dividers fade, never hard-rule. */
const toneClass: Record<SectionTone, string> = {
  default: "",
  "rule-top": "rule-top-fade",
  "rule-bottom": "rule-bottom-fade",
};

export const Section = ({
  children,
  pad = "lg",
  tone = "default",
  as,
  className,
  ...rest
}: SectionProps) => {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag className={cn(padClass[pad], toneClass[tone], className)} {...rest}>
      {children}
    </Tag>
  );
};

export default Section;
