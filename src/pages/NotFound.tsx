import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Eyebrow accent className="mb-8">// 404</Eyebrow>
            <h1 className="font-display font-light text-[88px] md:text-[128px] leading-[0.95] tracking-[-0.02em]">
              <span className="block">not found.</span>
              <span className="block font-editorial italic font-normal tracking-[-0.015em] text-[color:var(--text-secondary)]">
                or not here yet.
              </span>
            </h1>
            <p className="mt-12 font-sans text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[48ch]">
              the page at <span className="font-mono text-[14px] text-[color:var(--text-primary)]">{location.pathname}</span> doesn&apos;t exist.
            </p>
            <Link
              to="/"
              className="group inline-flex items-baseline gap-2 mt-10 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
            >
              <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                back home
              </span>
              <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default NotFound;
