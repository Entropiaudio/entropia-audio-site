import SiteLayout from "@/components/SiteLayout";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { copy } from "@/copy";

const About = () => {
  const c = copy.about;
  return (
    <SiteLayout>
      {/* ---------- headline ---------- */}
      <Section pad="xl">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[920px]">
            <Eyebrow accent className="mb-10 md:mb-14">
              {c.eyebrow}
            </Eyebrow>
            <h1 className="font-display font-light leading-[0.98] tracking-[-0.02em] text-[clamp(52px,9.5vw,108px)]">
              <span className="block">{c.headlineLine1}</span>
              <span className="block font-editorial italic font-normal tracking-[-0.015em] text-[0.6em] mt-3 md:mt-4 text-[color:var(--text-secondary)]">
                {c.headlineLine2}
              </span>
            </h1>
          </div>
        </Container>
      </Section>

      {/* ---------- portrait + paragraphs ---------- */}
      <Section pad="md" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <figure
              className="md:col-span-4 md:col-start-2 aspect-[4/5] w-full relative"
              aria-label="portrait of the entropia audio team"
            >
              <div className="absolute inset-0 border border-[color:var(--border-soft)]" />
              <div className="absolute inset-[1px] bg-[color:var(--surface)] flex items-center justify-center">
                <span className="text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
                  {c.portraitPlaceholder}
                </span>
              </div>
            </figure>

            <div className="md:col-span-6 space-y-6 font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch]">
              <p>{c.paragraph1}</p>
              <p>{c.paragraph2}</p>
              <p>{c.paragraph3}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- contact ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-3 md:col-start-2 md:pt-3">
              <Eyebrow>{c.contactEyebrow}</Eyebrow>
            </div>
            <div className="md:col-span-7">
              <a
                href={`mailto:${copy.contactEmail}`}
                className="group inline-flex items-baseline gap-3 font-editorial italic text-[28px] md:text-[36px] leading-[1.2] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
              >
                <span className="border-b border-[color:var(--text-tertiary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                  {copy.contactEmail}
                </span>
              </a>
              <p className="mt-5 text-[13px] font-mono lowercase tracking-[0.04em] text-[color:var(--text-tertiary)] leading-relaxed">
                {c.contactSubline}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default About;
