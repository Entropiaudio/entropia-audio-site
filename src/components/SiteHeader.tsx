import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { plugins } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";
import Logo from "./Logo";

/* Ghost pills on parchment (kit: Nav). Active page = ink-filled pill via
   the data-active attribute the .nav-pill class styles. */
const navLinkClass = "nav-pill";

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-4 font-mono font-semibold uppercase tracking-[0.14em] text-[19px] transition-colors duration-[200ms] ease-editorial ${
    isActive ? "text-[color:var(--accent-raw)]" : "text-[color:var(--ink)]"
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

  // scroll-aware header: parchment veil + hairline once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Expose header height as a CSS variable so other sticky bars
  // (PluginPage's buy/try-free strip) can sit flush against the header.
  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", "5rem");
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-lg transition-[background-color,border-color,box-shadow] duration-[300ms] ease-editorial border-b ${
        scrolled ? "border-hairline" : "border-transparent"
      }`}
      style={{
        background: scrolled ? "rgba(237, 224, 204, 0.92)" : "rgba(237, 224, 204, 0.55)",
      }}
    >
      <div
        className="max-w-wide mx-auto px-6 md:px-10 flex items-center justify-between h-20"
      >
        <Link
          to="/"
          aria-label={c.wordmark}
          className="group inline-flex items-center gap-3 text-[color:var(--ink)] transition-colors duration-[200ms] ease-editorial hover:text-[color:var(--accent-deep)]"
        >
          <Logo size={30} />
          <span className="font-editorial italic text-[20px] leading-none pb-0.5">
            {c.wordmark}
          </span>
        </Link>

        {/* desktop nav — white ghost pills, ink fill on the active page */}
        <nav className="hidden md:flex items-center gap-2.5">
          {plugins.map((p) => (
            <NavLink
              key={p.slug}
              to={`/plugins/${p.slug}`}
              className={navLinkClass}
              data-active={pathname === `/plugins/${p.slug}` || undefined}
            >
              {p.name}
            </NavLink>
          ))}
          <NavLink
            to="/about"
            className={navLinkClass}
            data-active={pathname === "/about" || undefined}
          >
            {c.nav.about}
          </NavLink>
          <NavLink
            to="/account"
            className={navLinkClass}
            data-active={pathname.startsWith("/account") || undefined}
          >
            {c.nav.account}
          </NavLink>
          <NavLink
            to="/cart"
            aria-label={`cart, ${count} items`}
            className="nav-pill flex items-baseline gap-1.5"
            data-active={pathname === "/cart" || undefined}
          >
            {c.nav.cart}
            <span className="text-[10px] tabular-nums opacity-60">({count})</span>
          </NavLink>
        </nav>

        {/* mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "close menu" : "open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-3 text-[color:var(--ink)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* mobile nav panel, intentionally NOT role=dialog/aria-modal because
          we don't trap focus. Escape closes via the keydown handler above. */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed left-0 right-0 top-20 z-30 overflow-y-auto h-[calc(100dvh-5rem)] bg-[color:var(--paper)]"
        >
          <nav className="px-6 pt-6 pb-10 flex flex-col divide-y divide-hairline">
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
                `flex items-baseline gap-2 py-4 font-mono font-semibold uppercase tracking-[0.14em] text-[19px] transition-colors duration-[200ms] ease-editorial ${
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
