import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <a href="#main" className="skip-link font-mono uppercase tracking-widest text-xs">
      skip to main content
    </a>
    <SiteHeader />
    <main id="main" className="flex-1">{children}</main>
    <SiteFooter />
  </div>
);

export default SiteLayout;
