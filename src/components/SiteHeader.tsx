import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { plugins } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";
import Logo from "./Logo";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[13px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial hover:text-[color:var(--accent-raw)] ${
    isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-4 text-[18px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial ${
    isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"
  }`;

const SiteHeader = () => {
  const { count } = useCart();
  const c = copy.header;
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--bg)]/85 backdrop-blur-md">
      <div className="max-w-wide mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link
          to="/"
          aria-label={c.wordmark}
          className="group inline-flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
        >
          <Logo size={26} />
          <span>{c.wordmark}</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-7 md:gap-10">
          {plugins.map((p) => (
            <NavLink key={p.slug} to={`/plugins/${p.slug}`} className={navLinkClass}>
              {p.name}
            </NavLink>
          ))}
          <NavLink to="/about" className={navLinkClass}>
            {c.nav.about}
          </NavLink>
          <NavLink to="/account" className={navLinkClass}>
            {c.nav.account}
          </NavLink>
          <NavLink
            to="/cart"
            aria-label={`cart, ${count} items`}
            className={({ isActive }) =>
              `text-[13px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial hover:text-[color:var(--accent-raw)] flex items-baseline gap-1.5 ${
                isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"
              }`
            }
          >
            {c.nav.cart}
            <span className="text-[11px] tabular-nums text-[color:var(--text-tertiary)]">
              ({count})
            </span>
          </NavLink>
        </nav>

        {/* mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "close menu" : "open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-3 text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* mobile nav panel */}
      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed left-0 right-0 top-20 z-30 bg-[color:var(--bg)] overflow-y-auto h-[calc(100dvh-5rem)]"
        >
          <nav className="px-6 pt-6 pb-10 flex flex-col">
            {plugins.map((p) => (
              <NavLink key={p.slug} to={`/plugins/${p.slug}`} className={mobileNavLinkClass}>
                {p.name}
              </NavLink>
            ))}
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
                `flex items-baseline gap-2 py-4 text-[18px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial ${
                  isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"
                }`
              }
            >
              {c.nav.cart}
              <span className="text-[13px] tabular-nums text-[color:var(--text-tertiary)]">
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
