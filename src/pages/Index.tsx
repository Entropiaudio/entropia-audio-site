import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import ProductRow from "@/components/ProductRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import HeroVisual from "@/components/HeroVisual";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import ScrubText from "@/components/motion/ScrubText";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";
import { plugins } from "@/data/plugins";
import { copy } from "@/copy";

const Index = () => {
  const c = copy.home;

  return (
    <SiteLayout>
      {/* ---------- hero ---------- */}
      <section
        className="relative isolate overflow-hidden min-h-[78vh] md:min-h-[92vh] flex items-end pt-24 md:pt-40 pb-14 md:pb-28"
      >
        <HeroVisual className="absolute inset-0 z-0" />

        {/* soft vignette to anchor type */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,17,15,0) 40%, rgba(20,17,15,0.55) 100%)",
          }}
        />

        <Container width="wide" className="relative z-10 w-full">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-7 md:mb-14">
                {c.eyebrow}
              </Eyebrow>
            </Reveal>

            <h1 className="font-display font-light leading-[0.95] tracking-[-0.02em] text-[clamp(48px,11vw,128px)]">
              <RevealWords
                as="span"
                className="block"
                {...MOTION.page.headline1}
                stagger={MOTION.stagger.word}
              >
                {c.headlineLine1}
              </RevealWords>
              <RevealWords
                as="span"
                className="block font-editorial italic font-normal tracking-[-0.015em] text-[0.88em] text-[color:var(--text-secondary)]"
                {...MOTION.page.headline2}
                stagger={MOTION.stagger.word}
              >
                {c.headlineLine2}
              </RevealWords>
            </h1>

            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="font-sans font-normal text-[16px] md:text-[18px] leading-[1.65] tracking-[0.005em] mt-8 md:mt-16 max-w-[54ch] text-[color:var(--text-secondary)]">
                {c.subline}
              </p>
            </Reveal>

            <Reveal variant="up" {...MOTION.page.cta}>
              <div className="mt-10 md:mt-14 flex items-center gap-8 md:gap-10">
                <MagneticLink
                  to="/plugins/chaosverb"
                  strength={6}
                  className="accent-glow inline-flex items-baseline gap-3 px-7 py-4 text-[12px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)]"
                >
                  <span>explore chaosverb</span>
                  <span aria-hidden="true" className="text-[14px] leading-none">→</span>
                </MagneticLink>
                <Link
                  to="/about"
                  className="link-draw text-[12px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[600ms] ease-editorial"
                >
                  our story
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>

      </section>

      {/* ---------- featured ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          {plugins.map((p) => (
            <ProductRow key={p.slug} plugin={p} />
          ))}
        </Container>
      </Section>

      {/* ---------- about strip with scrub reveal ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-3">
              <Eyebrow>{c.aboutEyebrow}</Eyebrow>
            </Reveal>
            <div className="md:col-span-7">
              <ScrubText
                className="font-editorial italic text-[26px] md:text-[34px] leading-[1.25] text-[color:var(--text-primary)]"
              >
                {c.aboutBlurb}
              </ScrubText>
              <Reveal variant="up" {...MOTION.section.cta}>
                <Link
                  to="/about"
                  className="group inline-flex items-baseline gap-2 mt-12 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-secondary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
                >
                  <span className="border-b border-[color:var(--text-tertiary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                    {c.aboutLink}
                  </span>
                  <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <NewsletterSignup />
    </SiteLayout>
  );
};

export default Index;
