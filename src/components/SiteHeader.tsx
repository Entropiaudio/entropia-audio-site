import { Link, NavLink } from "react-router-dom";
import { plugins } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";
import Logo from "./Logo";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[13px] font-mono uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-editorial hover:text-[color:var(--accent-raw)] ${
    isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"
  }`;

const SiteHeader = () => {
  const { count } = useCart();
  const c = copy.header;
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

        <nav className="flex items-center gap-7 md:gap-10">
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
      </div>
    </header>
  );
};

export default SiteHeader;
