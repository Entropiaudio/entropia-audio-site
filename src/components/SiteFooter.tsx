import { Link, useLocation } from "react-router-dom";
import { copy } from "@/copy";
import Logo from "./Logo";

/* Two lines: the lockup and the links, then a hairline with the colophon
   centred on it and one ink mark at the end. No columns, no blurb — the
   footer is a rule, not a sitemap. */

const SiteFooter = () => {
  const c = copy.footer;
  const { pathname } = useLocation();

  const links = [
    { to: "/plugins/chaosverb", label: c.nav.chaosverb },
    { to: "/plugins/fiction", label: c.nav.fiction },
    { to: "/about", label: c.nav.about },
    { to: "/account", label: c.nav.account },
    { to: "/legal/eula", label: c.nav.eula },
    { to: "/legal/privacy", label: c.nav.privacy },
  ];

  return (
    <footer className="relative z-10 px-[3.2vw] pt-10 pb-10 mt-4">
      <div className="flex items-center gap-6 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-[color:var(--ink)] transition-colors duration-[120ms] ease-editorial hover:text-[color:var(--accent-raw)]"
        >
          <Logo size={22} />
          <span className="font-editorial italic text-[16px] leading-none">{c.title}</span>
        </Link>

        <span className="flex-1" />

        <nav className="flex gap-5 flex-wrap">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="nav-link !text-[10px]"
              data-active={pathname === l.to || undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <span
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(42,23,30,0.28), transparent)",
          }}
        />
        <span className="font-mono font-semibold text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-3)] text-center">
          {c.colophon} · {new Date().getFullYear()}
        </span>
        <img
          src="/art/mark-footer.png"
          alt=""
          aria-hidden="true"
          className="w-[18px] mix-blend-multiply opacity-70"
        />
      </div>
    </footer>
  );
};

export default SiteFooter;
