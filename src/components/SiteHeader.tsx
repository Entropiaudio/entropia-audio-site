import { Link, NavLink } from "react-router-dom";
import { plugins } from "@/data/plugins";
import { useCart } from "@/context/CartContext";

const SiteHeader = () => {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-sm border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-medium tracking-tight hover:text-accent transition-colors"
        >
          entropia audio
        </Link>

        <nav className="flex items-center gap-6 md:gap-8 text-sm">
          {plugins.map((p) => (
            <NavLink
              key={p.slug}
              to={`/plugins/${p.slug}`}
              className={({ isActive }) =>
                `transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-foreground/70"
                }`
              }
            >
              {p.name}
            </NavLink>
          ))}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `transition-colors hover:text-accent ${
                isActive ? "text-accent" : "text-foreground/70"
              }`
            }
          >
            account
          </NavLink>
          <NavLink
            to="/cart"
            aria-label={`cart, ${count} items`}
            className={({ isActive }) =>
              `transition-colors hover:text-accent flex items-center gap-1 ${
                isActive ? "text-accent" : "text-foreground/70"
              }`
            }
          >
            cart
            <span className="font-mono text-xs text-foreground/50">({count})</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
