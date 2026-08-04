import { Link } from "react-router-dom";
import { copy } from "@/copy";
import Section from "./primitives/Section";
import Container from "./primitives/Container";
import Eyebrow from "./primitives/Eyebrow";
import Logo from "./Logo";

const footerLinkClass =
  "font-mono font-medium text-[14px] tracking-[0.06em] lowercase text-[color:var(--ink-2)] hover:text-[color:var(--accent-deep)] transition-colors duration-[200ms] ease-editorial";

const SiteFooter = () => {
  const c = copy.footer;
  return (
    <footer
      className="diag-cut-top bg-tan mt-24"
      style={{ "--cut": "44px" } as React.CSSProperties}
    >
      <Section pad="md" className="!pt-28 md:!pt-32">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5 md:col-start-2">
              <div className="flex items-center gap-4 mb-6">
                <Logo size={44} className="text-[color:var(--ink)]" />
                <span className="font-editorial italic text-[18px] text-[color:var(--ink)]">
                  {c.title}
                </span>
              </div>
              <p className="font-sans font-normal text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--ink-2)] max-w-[36ch]">
                {c.blurb}
              </p>
              <a
                href={`mailto:${copy.contactEmail}`}
                className="group inline-flex items-baseline gap-2 mt-6 font-mono font-medium text-[14px] lowercase tracking-[0.06em] text-[color:var(--ink)] hover:text-[color:var(--accent-deep)] transition-colors duration-[200ms] ease-editorial"
              >
                <span className="border-b border-[color:var(--ink-line-2)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[200ms] ease-editorial">
                  {copy.contactEmail}
                </span>
              </a>
            </div>

            <nav className="md:col-span-2 flex flex-col gap-3">
              <Eyebrow className="mb-2">{c.siteHeading}</Eyebrow>
              <Link to="/plugins/chaosverb" className={footerLinkClass + " normal-case"}>
                {c.nav.chaosverb}
              </Link>
              <Link to="/about" className={footerLinkClass}>
                {c.nav.about}
              </Link>
              <Link to="/account" className={footerLinkClass}>
                {c.nav.account}
              </Link>
            </nav>

            <nav className="md:col-span-2 flex flex-col gap-3">
              <Eyebrow className="mb-2">{c.legalHeading}</Eyebrow>
              <Link to="/legal/eula" className={footerLinkClass}>
                {c.nav.eula}
              </Link>
              <Link to="/legal/privacy" className={footerLinkClass}>
                {c.nav.privacy}
              </Link>
            </nav>
          </div>
        </Container>
      </Section>

      <div className="rule-top-fade">
        <Container width="wide" className="py-6 flex items-center justify-between font-mono font-medium text-[10px] uppercase tracking-eyebrow text-[color:var(--ink-3)]">
          <span>© {new Date().getFullYear()} {c.copyright}</span>
          <span>{c.tagLine}</span>
        </Container>
      </div>
    </footer>
  );
};

export default SiteFooter;
