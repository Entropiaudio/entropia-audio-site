import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Width = "editorial" | "wide" | "narrow";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width?: Width;
  /** Indent from the gutter, supports the asymmetric grid */
  indent?: "none" | "sm" | "md" | "lg";
}

const widthClass: Record<Width, string> = {
  narrow: "max-w-[640px]",
  editorial: "max-w-editorial",
  wide: "max-w-wide",
};

const indentClass = {
  none: "",
  sm: "md:pl-12",
  md: "md:pl-24",
  lg: "md:pl-40",
};

export const Container = ({
  children,
  width = "editorial",
  indent = "none",
  className,
  ...rest
}: ContainerProps) => (
  <div
    className={cn("mx-auto px-6 md:px-10", widthClass[width], indentClass[indent], className)}
    {...rest}
  >
    {children}
  </div>
);

export default Container;
