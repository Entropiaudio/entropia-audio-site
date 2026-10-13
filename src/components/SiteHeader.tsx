import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";
import Logo from "./Logo";

/* Small ink caps, no pills, no chrome — the header is a line of text and a
   mark. On the home page it rides fixed over the painted collage: a parchment
   scrim keeps it legible over the art at rest, and once the page scrolls it
   takes the buy strip's frosted paper (.header-float, index.css). Everywhere
   else it sits on the paper and scrolls away with it, leaving the product
   pages' buy strip as those pages' one sticky bar. */

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-4 font-mono font-semibold uppercase tracking-[0.16em] text-[19px] transition-colors duration-[120ms] ease-editorial ${
    isActive ? "text-[color:var(--accent-ink)]" : "text-[color:var(--ink)]"
  }`;

interface SiteHeaderProps {
  /** Float over the hero artwork instead of sitting on the page ground. */
  overlay?: boolean;
}

const SiteHeader = ({ overlay = false }: SiteHeaderProps) => {
  const { count } = useCart();
  const c = copy.header;
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const { pathname } = useLocation();
  // No ink-halo on the overlay links anymore: the halo was a paper glow that
  // carried the caps across the collage's dark shape, and over the header's
  // parchment scrim it only softened the letterforms. The scrim is the
  // readability layer now, and the type stays crisp ink.
  const navClass = "nav-link";

  // the fixed home header takes its opaque strip surface once the page moves
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // z-30, not 20: the header is a stacking context, so the mobile panel's own
  // z only counts inside it — and the ink front marks sit at z-20 in a LATER
  // sibling, which out-paints an equal-z header. At 30 the whole header
  // subtree (open menu included) covers the ink, and still sits under the
  // grain (55) and the scroll progress bar (60).
  return (
    <header
      className={
        overlay
          ? `fixed inset-x-0 top-0 z-30 pointer-events-none header-float ${
              // the open menu freezes the opaque strip so the bar above the
              // paper panel never shows the painting through a translucent gap
              stuck || open ? "is-stuck" : ""
            }`
          : "relative z-30"
      }
    >
      <div
        className={`flex items-center gap-6 px-[3.2vw] ${
          overlay ? "pt-6 pb-4 pointer-events-auto" : "py-5"
        }`}
      >
        <Link
          to="/"
          aria-label={c.wordmark}
          className="inline-flex items-center gap-3 text-[color:var(--ink)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-raw)]"
        >
          <Logo size={overlay ? 40 : 34} />
          {!overlay && <span className="sr-only">{c.wordmark}</span>}
        </Link>

        <span className="flex-1" />

        {/* desktop nav — ink caps, copper on hover, on the scrim's parchment
            over the collage and on plain paper everywhere else */}
        <nav className="hidden md:flex items-center gap-6">
          {/* the products lead, and they lead everywhere — the home-only
              "#plugins" jump link and the demo button both pointed at the same
              product records, so these replace them rather than joining them */}
          <NavLink
            to="/plugins/chaosverb"
            className={navClass}
            data-active={pathname === "/plugins/chaosverb" || undefined}
          >
            {c.nav.chaosverb}
          </NavLink>
          <NavLink
            to="/plugins/fiction"
            className={navClass}
            data-active={pathname === "/plugins/fiction" || undefined}
          >
            {c.nav.fiction}
          </NavLink>
          <NavLink
            to="/plugins/entropan"
            className={navClass}
            data-active={pathname === "/plugins/entropan" || undefined}
          >
            {c.nav.entropan}
          </NavLink>
          <NavLink
            to="/about"
            className={navClass}
            data-active={pathname === "/about" || undefined}
          >
            {c.nav.about}
          </NavLink>
          <NavLink
            to="/account"
            className={navClass}
            data-active={pathname.startsWith("/account") || undefined}
          >
            {c.nav.account}
          </NavLink>
          <NavLink
            to="/cart"
            aria-label={`cart, ${count} items`}
            className={`${navClass} inline-flex items-baseline gap-1.5`}
            data-active={pathname === "/cart" || undefined}
          >
            {c.nav.cart}
            {count > 0 && <span className="text-[10px] tabular-nums opacity-70">({count})</span>}
          </NavLink>
        </nav>

        {/* mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "close menu" : "open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-3 text-[color:var(--ink)] hover:text-[color:var(--accent-raw)] transition-colors duration-[120ms] ease-editorial"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* mobile nav panel, intentionally NOT role=dialog/aria-modal because
          we don't trap focus. Escape closes via the keydown handler above. */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-0 top-[76px] z-30 overflow-y-auto pointer-events-auto bg-[color:var(--paper)]"
        >
          <nav className="px-6 pt-6 pb-10 flex flex-col divide-y divide-hairline">
            <NavLink to="/plugins/chaosverb" className={mobileNavLinkClass}>
              {c.nav.chaosverb}
            </NavLink>
            <NavLink to="/plugins/fiction" className={mobileNavLinkClass}>
              {c.nav.fiction}
            </NavLink>
            <NavLink to="/plugins/entropan" className={mobileNavLinkClass}>
              {c.nav.entropan}
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass}>
              {c.nav.about}
            </NavLink>
            <NavLink to="/account" className={mobileNavLinkClass}>
              {c.nav.account}
            </NavLink>
            <NavLink
              to="/cart"
              aria-label={`cart, ${count} items`}
              className={({ isActive }) =>
                `flex items-baseline gap-2 py-4 font-mono font-semibold uppercase tracking-[0.16em] text-[19px] transition-colors duration-[120ms] ease-editorial ${
                  isActive ? "text-[color:var(--accent-ink)]" : "text-[color:var(--ink)]"
                }`
              }
            >
              {c.nav.cart}
              <span className="text-[13px] tabular-nums text-[color:var(--ink-3)]">
                ({count})
              </span>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
