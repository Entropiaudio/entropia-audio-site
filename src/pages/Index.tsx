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
      {/* ---------- hero: parchment field, painting flourish, 12° bottom cut ---------- */}
      <section
        className="relative isolate overflow-hidden min-h-[78vh] md:min-h-[92vh] flex items-end pt-24 md:pt-40 pb-20 md:pb-32"
      >
        <HeroVisual className="absolute inset-0 z-0" art cut />

        {/* soft paper wash to anchor the ink type over the painted field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(237,224,204,0) 45%, rgba(237,224,204,0.55) 100%)",
          }}
        />

        <Container width="wide" className="relative z-10 w-full">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-7 md:mb-12">
                {c.eyebrow}
              </Eyebrow>
            </Reveal>

            <h1 className="text-[color:var(--ink)]">
              <RevealWords
                as="span"
                className="block font-serif-caps leading-[1.05] text-[clamp(30px,5.5vw,58px)] ink-halo"
                {...MOTION.page.headline1}
                stagger={MOTION.stagger.word}
              >
                {c.headlineLine1}
              </RevealWords>
              <RevealWords
                as="span"
                className="block font-display leading-[0.92] tracking-[0.015em] text-[clamp(58px,11.5vw,132px)] mt-2 ink-halo-lg"
                {...MOTION.page.headline2}
                stagger={MOTION.stagger.word}
              >
                {c.headlineLine2}
              </RevealWords>
            </h1>

            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="font-sans font-normal text-[16px] md:text-[18px] leading-[1.65] tracking-[0.005em] mt-8 md:mt-12 max-w-[54ch] text-[color:var(--ink-2)] ink-halo">
                {c.subline}
              </p>
            </Reveal>

            <Reveal variant="up" {...MOTION.page.cta}>
              <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-4">
                <MagneticLink
                  to="/plugins/chaosverb"
                  strength={6}
                  className="btn btn-solid text-[13px] px-7 py-3.5"
                >
                  <span>explore chaosverb</span>
                  <span aria-hidden="true" className="text-[14px] leading-none">→</span>
                </MagneticLink>
                <Link to="/about" className="btn btn-ghost text-[13px] px-7 py-3.5">
                  our story
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- featured ---------- */}
      <Section pad="lg" className="!pt-14 md:!pt-20">
        <Container width="wide">
          {plugins.map((p) => (
            <ProductRow key={p.slug} plugin={p} />
          ))}
        </Container>
      </Section>

      {/* ---------- about band: tan ground, 12° top cut, painted flourish ---------- */}
      <section
        className="relative diag-cut-top bg-tan overflow-hidden"
        style={{ "--cut": "44px" } as React.CSSProperties}
      >
        {/* the flourish, mirrored, hugging the low left corner */}
        <img
          src="/art/approach-flourish.png"
          alt=""
          aria-hidden="true"
          className="absolute left-[-6%] bottom-[-10%] w-[62%] md:w-[42%] max-w-[560px] h-auto pointer-events-none select-none -scale-x-100"
          style={{
            filter:
              "drop-shadow(0 9px 18px rgba(38,16,25,0.30)) drop-shadow(0 3px 5px rgba(38,16,25,0.42)) drop-shadow(0 0 36px rgba(221,110,38,0.30))",
          }}
          draggable={false}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(224,208,176,0.42) 0%, rgba(224,208,176,0.12) 40%, rgba(224,208,176,0) 62%)",
          }}
        />

        <Container width="wide" className="relative py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-3">
              <Eyebrow className="text-[color:var(--ink-2)]">{c.aboutEyebrow}</Eyebrow>
            </Reveal>
            <div className="md:col-span-7">
              <ScrubText
                className="font-editorial italic text-[26px] md:text-[34px] leading-[1.3] text-[color:var(--ink)] ink-halo"
              >
                {c.aboutBlurb}
              </ScrubText>
              <Reveal variant="up" {...MOTION.section.cta}>
                <Link
                  to="/about"
                  className="group inline-flex items-baseline gap-2 mt-12 font-mono font-semibold text-[13px] uppercase tracking-label text-[color:var(--ink)] hover:text-[color:var(--accent-deep)] transition-colors duration-[200ms] ease-editorial"
                >
                  <span className="border-b border-[color:var(--ink-line-2)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[200ms] ease-editorial">
                    {c.aboutLink}
                  </span>
                  <span className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <NewsletterSignup />
    </SiteLayout>
  );
};

export default Index;
