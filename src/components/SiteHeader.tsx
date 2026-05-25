import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { plugins } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";
import Logo from "./Logo";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-[13px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial hover:text-[color:var(--accent-raw)] ${
    isActive
      ? "text-[color:var(--text-primary)] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-px after:bg-[color:var(--accent-raw)]"
      : "text-[color:var(--text-tertiary)]"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-4 text-[18px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial ${
    isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"
  }`;

const SiteHeader = () => {
  const { count } = useCart();
  const c = copy.header;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

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

  // scroll-aware header shrink + heavier blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,backdrop-filter,height,border-color] duration-[500ms] ease-editorial ${
        scrolled
          ? "bg-[color:var(--bg)]/90 backdrop-blur-xl border-b border-hairline"
          : "bg-[color:var(--bg)]/55 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div
        className={`max-w-wide mx-auto px-6 md:px-10 flex items-center justify-between transition-[height] duration-[500ms] ease-editorial ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link
          to="/"
          aria-label={c.wordmark}
          className="group inline-flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
        >
          <Logo size={scrolled ? 22 : 26} className="transition-[width,height] duration-[500ms] ease-editorial" />
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
              `relative text-[13px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial hover:text-[color:var(--accent-raw)] flex items-baseline gap-1.5 ${
                isActive
                  ? "text-[color:var(--text-primary)] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-px after:bg-[color:var(--accent-raw)]"
                  : "text-[color:var(--text-tertiary)]"
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

      {/* mobile nav panel — intentionally NOT role=dialog/aria-modal because
          we don't trap focus. Escape closes via the keydown handler above. */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed left-0 right-0 top-16 z-30 bg-[color:var(--bg)] overflow-y-auto h-[calc(100dvh-4rem)]"
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
