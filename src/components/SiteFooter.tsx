import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="border-t border-hairline mt-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-foreground/60">
        <div>
          <span className="text-foreground">entropia audio</span>
          <span className="ml-3">© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/account" className="hover:text-accent transition-colors">
            account
          </Link>
          <Link to="/legal/eula" className="hover:text-accent transition-colors">
            eula
          </Link>
          <Link to="/legal/privacy" className="hover:text-accent transition-colors">
            privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;
