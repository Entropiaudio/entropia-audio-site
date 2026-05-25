import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ScrollProgress from "./motion/ScrollProgress";
import Grain from "./motion/Grain";

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">
    <a href="#main" className="skip-link font-mono uppercase tracking-widest text-xs">
      skip to main content
    </a>
    <ScrollProgress />
    <Grain />
    <SiteHeader />
    <main id="main" className="flex-1">{children}</main>
    <SiteFooter />
  </div>
);

export default SiteLayout;
