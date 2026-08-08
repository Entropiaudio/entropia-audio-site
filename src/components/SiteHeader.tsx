import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";
import InkButton from "./InkButton";
import Logo from "./Logo";

/* Small ink caps, no pills, no chrome — the header is a line of text and a
   mark. On the home page it floats over the painted collage; everywhere else
   it sits on the paper. Either way it scrolls away: the only thing that
   sticks on this site is the product page's buy strip. */

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-4 font-mono font-semibold uppercase tracking-[0.16em] text-[19px] transition-colors duration-[120ms] ease-editorial ${
    isActive ? "text-[color:var(--accent-raw)]" : "text-[color:var(--ink)]"
  }`;

interface SiteHeaderProps {
  /** Float over the hero artwork instead of sitting on the page ground. */
  overlay?: boolean;
}

const SiteHeader = ({ overlay = false }: SiteHeaderProps) => {
  const { count } = useCart();
  const c = copy.header;
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navClass = overlay ? "nav-link ink-halo" : "nav-link";

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

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-20 pointer-events-none"
          : "relative z-20"
      }
    >
      <div
        className={`flex items-center gap-6 px-[3.2vw] ${
          overlay ? "pt-6 pointer-events-auto" : "py-5"
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

        {/* desktop nav — ink caps, copper on hover. Over the collage the links
            cross a dark torn shape at the top right, so they carry a paper
            halo there; on plain paper it's invisible. */}
        <nav className="hidden md:flex items-center gap-6">
          {overlay && (
            <a href="#plugins" className={navClass}>
              {c.nav.plugins}
            </a>
          )}
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
          {overlay && (
            <InkButton to="/plugins/chaosverb#try" size="md" className="ml-1">
              {c.cta}
            </InkButton>
          )}
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
              Chaosverb
            </NavLink>
            <NavLink to="/plugins/fiction" className={mobileNavLinkClass}>
              Fiction
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
                  isActive ? "text-[color:var(--accent-raw)]" : "text-[color:var(--ink)]"
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
