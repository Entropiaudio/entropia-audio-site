import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PageBackdrop from "./PageBackdrop";
import InkLayer from "./InkLayer";
import InkEditor from "./ink/InkEditor";
import ScrollProgress from "./motion/ScrollProgress";
import Grain from "./motion/Grain";

interface SiteLayoutProps {
  children: ReactNode;
  /** Paint the collage backdrop behind the page. Off on the home page, which
   *  carries the real painting in its hero instead. */
  backdrop?: boolean;
  /** Float the header over the first section (the home hero). */
  overlay?: boolean;
  /** Drop the plum wedge at the foot — for pages that end on a tan band. */
  plum?: boolean;
}

const SiteLayout = ({
  children,
  backdrop = true,
  overlay = false,
  plum = true,
}: SiteLayoutProps) => (
  // overflow-x-clip (not overflow-x-hidden), `hidden` creates a scroll
  // container, which silently breaks `position: sticky` for the plugin page's
  // buy strip. `clip` clips overflow visually without creating a scroll
  // context, so sticky stays sticky.
  <div className="relative min-h-screen flex flex-col overflow-x-clip bg-paper">
    <a href="#main" className="skip-link font-mono uppercase tracking-widest text-xs">
      skip to main content
    </a>
    <ScrollProgress />
    <Grain />
    {backdrop && <PageBackdrop foot plum={plum} />}
    <InkLayer />
    <SiteHeader overlay={overlay} />
    <main id="main" className="relative z-10 flex-1">
      {children}
    </main>
    <SiteFooter />
    {/* Dev only. `import.meta.env.DEV` is a compile-time false in a build, so
        the editor and its save endpoint never reach production. */}
    {import.meta.env.DEV && <InkEditor />}
  </div>
);

export default SiteLayout;
