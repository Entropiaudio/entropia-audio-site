import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";
import { copy } from "@/copy";

const About = () => {
  const c = copy.about;
  return (
    <SiteLayout>
      {/* ---------- headline ---------- */}
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-10 md:mb-14">
                {c.eyebrow}
              </Eyebrow>
            </Reveal>
            <h1 className="text-[color:var(--ink)]">
              <RevealWords
                as="span"
                className="block font-display leading-[0.95] text-[clamp(52px,9.5vw,108px)]"
                {...MOTION.page.headline1}
                stagger={MOTION.stagger.word}
              >
                {c.headlineLine1}
              </RevealWords>
              <RevealWords
                as="span"
                className="block font-editorial italic font-normal text-[clamp(24px,3.8vw,42px)] leading-[1.25] mt-3 md:mt-5 text-[color:var(--ink-2)]"
                {...MOTION.page.headline2}
                stagger={MOTION.stagger.word}
              >
                {c.headlineLine2}
              </RevealWords>
            </h1>
          </div>
        </Container>
      </Section>

      {/* ---------- portrait + paragraphs ---------- */}
      <Section pad="md" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-7 md:col-start-2 space-y-6 font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch]">
              <Reveal variant="up" duration={MOTION.duration.base}>
                <p>{c.paragraph1}</p>
              </Reveal>
              <Reveal variant="up" duration={MOTION.duration.base} delay={MOTION.stagger.body}>
                <p>{c.paragraph2}</p>
              </Reveal>
              <Reveal variant="up" duration={MOTION.duration.base} delay={MOTION.stagger.body * 2}>
                <p>{c.paragraph3}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- contact — tan band, diagonal separation ---------- */}
      <Section
        pad="lg"
        className="bg-tan diag-cut-top !pt-28 md:!pt-40"
        style={{ "--cut": "44px" } as React.CSSProperties}
      >
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-3">
              <Eyebrow>{c.contactEyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="up" {...MOTION.section.headline} className="md:col-span-7">
              <MagneticLink
                as="a"
                href={`mailto:${copy.contactEmail}`}
                strength={6}
                className="group inline-flex items-baseline gap-3 font-editorial italic text-[28px] md:text-[36px] leading-[1.2] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[200ms] ease-editorial"
              >
                <span className="link-draw pb-1">
                  {copy.contactEmail}
                </span>
              </MagneticLink>
              <p className="mt-5 text-[13px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-tertiary)] leading-relaxed">
                {c.contactSubline}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default About;
