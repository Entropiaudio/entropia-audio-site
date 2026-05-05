import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="border-t border-hairline mt-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-[2fr,1fr,1fr] gap-12 md:gap-20">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-4">
            entropia audio
          </div>
          <p className="text-base text-foreground/65 leading-relaxed measure-tight">
            a small studio of two, making serious audio plugins. designed and built with care.
          </p>
          <a
            href="mailto:entropia.audio@gmail.com"
            className="inline-block mt-5 text-sm border-b border-foreground/30 hover:border-foreground hover:text-accent pb-0.5 transition-colors"
          >
            entropia.audio@gmail.com
          </a>
        </div>

        <nav className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-1">
            site
          </span>
          <Link to="/plugins/chaosverb" className="text-foreground/70 hover:text-accent transition-colors">
            chaosverb
          </Link>
          <Link to="/about" className="text-foreground/70 hover:text-accent transition-colors">
            about
          </Link>
          <Link to="/account" className="text-foreground/70 hover:text-accent transition-colors">
            account
          </Link>
        </nav>

        <nav className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-1">
            legal
          </span>
          <Link to="/legal/eula" className="text-foreground/70 hover:text-accent transition-colors">
            eula
          </Link>
          <Link to="/legal/privacy" className="text-foreground/70 hover:text-accent transition-colors">
            privacy
          </Link>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 border-t border-hairline flex items-center justify-between text-xs font-mono uppercase tracking-widest text-foreground/55">
        <span>© {new Date().getFullYear()} entropia audio</span>
        <span>made by two</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
