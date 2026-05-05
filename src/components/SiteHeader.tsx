import { Link, NavLink } from "react-router-dom";
import { plugins } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { copy } from "@/copy";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-accent ${
    isActive ? "text-foreground" : "text-foreground/55"
  }`;

const SiteHeader = () => {
  const { count } = useCart();
  const c = copy.header;
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-sm border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.3em] hover:text-accent transition-colors"
        >
          {c.wordmark}
        </Link>

        <nav className="flex items-center gap-6 md:gap-8 text-sm">
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
              `transition-colors hover:text-accent flex items-center gap-1 ${
                isActive ? "text-foreground" : "text-foreground/55"
              }`
            }
          >
            {c.nav.cart}
            <span className="font-mono text-xs text-foreground/55">({count})</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
