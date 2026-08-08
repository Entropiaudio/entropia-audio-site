import { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useScrollMotion";

/**
 * The brand button, in one place.
 *
 *   variant "solid" — ink fill that warms to copper. the primary CTA.
 *   variant "ghost" — white pill on parchment. secondary actions, nav.
 *   variant "pill"  — the plugin's technical control (play / stop / mode).
 *
 * Sizes are the design system's fixed heights: sm 22px, md 34px, lg 42px.
 * The element follows the props: `to` renders a router Link, `href` an
 * anchor, neither a <button>. Skins live in index.css as .btn-*, so a bare
 * <button className="btn btn-solid"> stays valid where a component is
 * overkill.
 */

type Variant = "solid" | "ghost" | "pill";
type Size = "sm" | "md" | "lg";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Trailing glyph — the arrow / caret that most CTAs carry. */
  trailing?: ReactNode;
  /** Subtle magnetic pull toward the cursor. Off by default. */
  magnetic?: boolean | number;
};

type Props = Common &
  (
    | ({ to: string; href?: never } & Omit<ComponentPropsWithoutRef<typeof Link>, "to" | "className" | "children">)
    | ({ href: string; to?: never } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">)
    | ({ to?: never; href?: never } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">)
  );

const skin: Record<Variant, string> = {
  solid: "btn-solid",
  ghost: "btn-ghost",
  pill: "btn-pill",
};

const metric: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const InkButton = (props: Props) => {
  const {
    children,
    variant = "solid",
    size = "md",
    className,
    trailing,
    magnetic = false,
    ...rest
  } = props as Common & Record<string, unknown>;

  const magnet = useMagnetic<HTMLSpanElement>(
    magnetic === false ? 0 : magnetic === true ? 6 : magnetic,
  );

  const classes = cn("btn", metric[size], skin[variant], className);
  const body = (
    <span ref={magnet} className="inline-flex items-center gap-[0.6em]">
      <span>{children}</span>
      {trailing && (
        <span aria-hidden="true" className="leading-none">
          {trailing}
        </span>
      )}
    </span>
  );

  if ("to" in props && props.to !== undefined) {
    const { to, ...linkRest } = rest as { to: string } & ComponentPropsWithoutRef<typeof Link>;
    return (
      <Link to={to} className={classes} {...linkRest}>
        {body}
      </Link>
    );
  }
  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as { href: string } & ComponentPropsWithoutRef<"a">;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {body}
      </a>
    );
  }
  const buttonRest = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {body}
    </button>
  );
};

export default InkButton;
