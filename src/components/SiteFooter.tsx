import { Link } from "react-router-dom";
import { copy } from "@/copy";
import Section from "./primitives/Section";
import Container from "./primitives/Container";
import Eyebrow from "./primitives/Eyebrow";
import Logo from "./Logo";

const SiteFooter = () => {
  const c = copy.footer;
  return (
    <footer className="border-t border-hairline mt-32">
      <Section pad="md">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5 md:col-start-2">
              <div className="flex items-center gap-4 mb-6">
                <Logo size={44} className="text-[color:var(--text-primary)]" />
                <Eyebrow>{c.title}</Eyebrow>
              </div>
              <p className="font-sans font-normal text-[16px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[36ch]">
                {c.blurb}
              </p>
              <a
                href={`mailto:${copy.contactEmail}`}
                className="group inline-flex items-baseline gap-2 mt-6 text-[13px] font-mono lowercase tracking-[0.06em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
              >
                <span className="border-b border-[color:var(--text-tertiary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                  {copy.contactEmail}
                </span>
              </a>
            </div>

            <nav className="md:col-span-2 flex flex-col gap-3">
              <Eyebrow className="mb-2">{c.siteHeading}</Eyebrow>
              <Link
                to="/plugins/chaosverb"
                className="text-[14px] font-mono normal-case tracking-[0.04em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
              >
                {c.nav.chaosverb}
              </Link>
              <Link
                to="/about"
                className="text-[14px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
              >
                {c.nav.about}
              </Link>
              <Link
                to="/account"
                className="text-[14px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
              >
                {c.nav.account}
              </Link>
            </nav>

            <nav className="md:col-span-2 flex flex-col gap-3">
              <Eyebrow className="mb-2">{c.legalHeading}</Eyebrow>
              <Link
                to="/legal/eula"
                className="text-[14px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
              >
                {c.nav.eula}
              </Link>
              <Link
                to="/legal/privacy"
                className="text-[14px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
              >
                {c.nav.privacy}
              </Link>
            </nav>
          </div>
        </Container>
      </Section>

      <div className="border-t border-hairline">
        <Container width="wide" className="py-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
          <span>© {new Date().getFullYear()} {c.copyright}</span>
          <span>{c.tagLine}</span>
        </Container>
      </div>
    </footer>
  );
};

export default SiteFooter;
