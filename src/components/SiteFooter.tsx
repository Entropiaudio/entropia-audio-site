import { Link } from "react-router-dom";
import { copy } from "@/copy";

const SiteFooter = () => {
  const c = copy.footer;
  return (
    <footer className="border-t border-hairline mt-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-[2fr,1fr,1fr] gap-12 md:gap-20">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">
            {c.title}
          </div>
          <p className="text-base text-foreground/65 leading-relaxed measure-tight">
            {c.blurb}
          </p>
          <a
            href={`mailto:${copy.contactEmail}`}
            className="inline-block mt-5 text-sm border-b border-foreground/30 hover:border-foreground hover:text-accent pb-0.5 transition-colors"
          >
            {copy.contactEmail}
          </a>
        </div>

        <nav className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-1">
            {c.siteHeading}
          </span>
          <Link to="/plugins/chaosverb" className="text-foreground/70 hover:text-accent transition-colors">
            {c.nav.chaosverb}
          </Link>
          <Link to="/about" className="text-foreground/70 hover:text-accent transition-colors">
            {c.nav.about}
          </Link>
          <Link to="/account" className="text-foreground/70 hover:text-accent transition-colors">
            {c.nav.account}
          </Link>
        </nav>

        <nav className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-1">
            {c.legalHeading}
          </span>
          <Link to="/legal/eula" className="text-foreground/70 hover:text-accent transition-colors">
            {c.nav.eula}
          </Link>
          <Link to="/legal/privacy" className="text-foreground/70 hover:text-accent transition-colors">
            {c.nav.privacy}
          </Link>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 border-t border-hairline flex items-center justify-between text-xs font-mono uppercase tracking-widest text-foreground/55">
        <span>© {new Date().getFullYear()} {c.copyright}</span>
        <span>{c.tagLine}</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
