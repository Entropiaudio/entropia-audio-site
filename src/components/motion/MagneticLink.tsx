import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMagnetic } from "@/hooks/useScrollMotion";
import { cn } from "@/lib/utils";

type Common = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

type AsLink = Common &
  ComponentPropsWithoutRef<typeof Link> & {
    as?: "link";
  };

type AsButton = Common &
  ComponentPropsWithoutRef<"button"> & {
    as: "button";
  };

type AsAnchor = Common &
  ComponentPropsWithoutRef<"a"> & {
    as: "a";
  };

type Props = AsLink | AsButton | AsAnchor;

/**
 * Wraps a CTA with subtle magnetic pull. The transform is applied to an inner
 * wrapper so callers can still combine layout className with motion.
 */
const MagneticLink = forwardRef<HTMLElement, Props>((props, _ref) => {
  const { children, strength = 10, className, ...rest } = props as Common & {
    [k: string]: unknown;
  };
  const magnet = useMagnetic<HTMLSpanElement>(strength);

  const inner = (
    <span ref={magnet} className="inline-flex items-baseline gap-2">
      {children}
    </span>
  );

  if ((props as AsButton).as === "button") {
    const { as: _as, ...buttonRest } = rest as ComponentPropsWithoutRef<"button"> & {
      as: "button";
    };
    return (
      <button {...buttonRest} className={cn(className)}>
        {inner}
      </button>
    );
  }
  if ((props as AsAnchor).as === "a") {
    const { as: _as, ...anchorRest } = rest as ComponentPropsWithoutRef<"a"> & {
      as: "a";
    };
    return (
      <a {...anchorRest} className={cn(className)}>
        {inner}
      </a>
    );
  }
  const { as: _as, ...linkRest } = rest as ComponentPropsWithoutRef<typeof Link> & {
    as?: "link";
  };
  return (
    <Link {...(linkRest as ComponentPropsWithoutRef<typeof Link>)} className={cn(className)}>
      {inner}
    </Link>
  );
});

MagneticLink.displayName = "MagneticLink";

export default MagneticLink;
