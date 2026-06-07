import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { copy } from "@/copy";

type Kind = "eula" | "privacy";

const Legal = ({ kind }: { kind: Kind }) => {
  const c = copy.legal[kind];

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">
                {c.eyebrow}
              </Eyebrow>
            </Reveal>
            <h1 className="font-display font-light leading-[1.0] tracking-[-0.02em] text-[clamp(40px,7vw,80px)]">
              <Reveal
                as="span"
                variant="up"
                className="inline-block font-editorial italic font-normal tracking-[-0.015em]"
                delay={MOTION.page.headline1.delay}
                duration={MOTION.duration.instant}
              >
                {c.title}
              </Reveal>
            </h1>
            <Reveal variant="up" delay={MOTION.page.headline2.delay} duration={MOTION.duration.base}>
              <p className="mt-6 text-[12px] font-mono lowercase tracking-[0.06em] text-[color:var(--text-tertiary)]">
                {c.lastUpdated}
              </p>
            </Reveal>

            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="mt-12 font-sans text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[58ch]">
                {c.intro}
              </p>
            </Reveal>

            <div className="mt-16 md:mt-20">
              {c.sections.map((s, i) => (
                <Reveal
                  key={i}
                  variant="up"
                  duration={MOTION.duration.base}
                  delay={i * MOTION.stagger.list}
                  as="article"
                  className="grid md:grid-cols-[3rem,1fr] gap-6 md:gap-10 border-t border-hairline py-8 md:py-10"
                >
                  <span className="font-mono text-[12px] tabular-nums text-[color:var(--text-tertiary)] md:pt-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display font-light text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.015em] text-[color:var(--text-primary)] mb-4">
                      {s.heading}
                    </h2>
                    <p className="font-sans text-[16px] md:text-[17px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[58ch]">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default Legal;
