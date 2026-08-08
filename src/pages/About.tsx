import SiteLayout from "@/components/SiteLayout";
import LabelledSection from "@/components/primitives/LabelledSection";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";
import { copy } from "@/copy";

const About = () => {
  const c = copy.about;
  return (
    // ends on the tan contact band, so the plum wedge would collide with it
    <SiteLayout plum={false}>
      {/* ---------- headline ---------- */}
      <section className="relative px-[3.2vw] pt-[84px] pb-14">
        <h1 className="max-w-[940px] m-0">
          <RevealWords
            as="span"
            className="block font-serif-display text-[clamp(48px,8vw,108px)] leading-[0.96] text-[color:var(--ink)]"
            {...MOTION.page.headline1}
            stagger={MOTION.stagger.word}
          >
            {c.headlineLine1}
          </RevealWords>
          <Reveal variant="up" {...MOTION.page.headline2}>
            <span
              className="block font-editorial italic text-[clamp(22px,3.4vw,42px)] leading-[1.25] text-[color:var(--ink-2)] mt-4"
              style={{ fontWeight: 430 }}
            >
              {c.headlineLine2}
            </span>
          </Reveal>
        </h1>
      </section>

      {/* ---------- the message ---------- */}
      <section className="px-[3.2vw] pt-10 pb-[84px] border-t border-hairline">
        <div className="max-w-[640px] md:ml-[8vw] flex flex-col gap-5">
          {[c.paragraph1, c.paragraph2, c.paragraph3].map((p, i) => (
            <Reveal
              key={i}
              variant="up"
              duration={MOTION.duration.base}
              delay={i * MOTION.stagger.body}
            >
              <p className="font-mono text-[15.5px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] m-0">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- contact: the tan ground ---------- */}
      <div
        className="relative diag-band-top"
        style={{
          background: "var(--tan)",
          paddingTop: "calc(3vw + 64px)",
          paddingBottom: "110px",
        }}
      >
        <LabelledSection label={c.contactEyebrow} labelTone="deep" labelPad="14px">
          <Reveal variant="up" {...MOTION.section.headline}>
            <MagneticLink
              as="a"
              href={`mailto:${copy.contactEmail}`}
              strength={6}
              className="inline-block font-editorial italic text-[clamp(24px,3vw,36px)] leading-[1.2] text-[color:var(--ink)] border-b border-[color:var(--ink-line-2)] pb-1 transition-colors duration-[200ms] ease-editorial hover:text-[color:var(--accent-deep)] hover:border-[color:var(--accent-deep)]"
            >
              {copy.contactEmail}
            </MagneticLink>
            <p className="font-mono text-[12px] tracking-[0.04em] text-[color:var(--ink-3)] mt-5 mb-0">
              {c.contactSubline}
            </p>
          </Reveal>
        </LabelledSection>
      </div>
    </SiteLayout>
  );
};

export default About;
