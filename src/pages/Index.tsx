import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import ProductRow from "@/components/ProductRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import HeroVisual from "@/components/HeroVisual";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { plugins } from "@/data/plugins";
import { copy } from "@/copy";

const Index = () => {
  const c = copy.home;
  return (
    <SiteLayout>
      {/* ---------- hero ---------- */}
      <section
        className="relative isolate overflow-hidden min-h-[78vh] md:min-h-[88vh] flex items-end pt-24 md:pt-40 pb-14 md:pb-28"
      >
        <HeroVisual className="absolute inset-0 z-0" />

        <Container width="wide" className="relative z-10 w-full">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Eyebrow accent className="mb-7 md:mb-14 animate-fade-in">
              {c.eyebrow}
            </Eyebrow>

            <h1
              className="font-display font-light leading-[0.95] tracking-[-0.02em] text-[clamp(48px,11vw,128px)] animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <span className="block">{c.headlineLine1}</span>
              <span
                className="block font-editorial italic font-normal tracking-[-0.015em] text-[0.88em] text-[color:var(--text-secondary)]"
              >
                {c.headlineLine2}
              </span>
            </h1>

            <p
              className="font-sans font-normal text-[16px] md:text-[18px] leading-[1.65] tracking-[0.005em] mt-8 md:mt-16 max-w-[54ch] text-[color:var(--text-secondary)] animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              {c.subline}
            </p>
          </div>
        </Container>
      </section>

      {/* ---------- featured ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 mb-16 md:mb-20">
            <Eyebrow>{c.featuredEyebrow}</Eyebrow>
          </div>
          {plugins.map((p) => (
            <ProductRow key={p.slug} plugin={p} />
          ))}
        </Container>
      </Section>

      {/* ---------- about strip ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-3 md:col-start-2 md:pt-3">
              <Eyebrow>{c.aboutEyebrow}</Eyebrow>
            </div>
            <div className="md:col-span-7">
              <p className="font-editorial italic text-[26px] md:text-[34px] leading-[1.25] text-[color:var(--text-primary)]">
                {c.aboutBlurb}
              </p>
              <Link
                to="/about"
                className="group inline-flex items-baseline gap-2 mt-12 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
              >
                <span className="border-b border-[color:var(--text-tertiary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                  {c.aboutLink}
                </span>
                <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <NewsletterSignup />
    </SiteLayout>
  );
};

export default Index;
