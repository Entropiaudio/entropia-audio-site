import { useLocation } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";

const NotFound = () => {
  const location = useLocation();

  return (
    <SiteLayout>
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow accent className="mb-8">// 404</Eyebrow>
            </Reveal>
            <h1 className="font-display font-light text-[88px] md:text-[128px] leading-[0.95] tracking-[-0.02em]">
              <Reveal as="span" variant="up" className="block" delay={MOTION.page.headline1.delay} duration={MOTION.duration.instant}>
                not found.
              </Reveal>
              <Reveal
                as="span"
                variant="up"
                className="block font-editorial italic font-normal tracking-[-0.015em] text-[color:var(--text-secondary)]"
                delay={MOTION.page.headline2.delay}
                duration={MOTION.duration.instant}
              >
                or not here yet.
              </Reveal>
            </h1>
            <Reveal variant="up" {...MOTION.page.body0}>
              <p className="mt-12 font-sans text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[48ch]">
                the page at <span className="font-mono text-[14px] text-[color:var(--text-primary)]">{location.pathname}</span> doesn&apos;t exist.
              </p>
            </Reveal>
            <Reveal variant="up" {...MOTION.page.cta}>
              <MagneticLink
                to="/"
                strength={6}
                className="accent-glow group inline-flex items-baseline gap-2 mt-10 px-6 py-3.5 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)]"
              >
                <span>back home</span>
                <span aria-hidden="true" className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
              </MagneticLink>
            </Reveal>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default NotFound;
