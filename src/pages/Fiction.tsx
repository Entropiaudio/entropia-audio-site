import SiteLayout from "@/components/SiteLayout";
import NewsletterSignup from "@/components/NewsletterSignup";
import LabelledSection from "@/components/primitives/LabelledSection";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import { MOTION } from "@/components/motion/timing";
import { getPlugin } from "@/data/plugins";
import { copy } from "@/copy";

/**
 * Fiction — not out yet, so this page sells the idea and takes an email.
 * No price, no cart, no trial: the hero, the interface as it stands, what it
 * does, then the mailing list. The mulberry accent (--section-motion) codes
 * the whole page as "in development", the way copper codes Chaosverb as
 * shipping.
 */
const Fiction = () => {
  const c = copy.fiction;
  const plugin = getPlugin("fiction")!;

  return (
    // the page ends on the tan mailing-list band, so the plum wedge would
    // collide with it — drop the wedge, keep the fleck.
    <SiteLayout plum={false}>
      {/* ---------- hero ---------- */}
      <section className="relative px-[3.2vw] pt-[72px] pb-10">
        <div className="max-w-[940px]">
          <h1 className="font-serif-display text-[clamp(46px,7vw,110px)] leading-[0.98] text-[color:var(--ink)] m-0">
            <RevealWords as="span" {...MOTION.page.headline1} stagger={MOTION.stagger.word}>
              {c.headline}
            </RevealWords>
          </h1>

          <Reveal variant="up" {...MOTION.page.headline2}>
            <p className="font-editorial italic text-[clamp(20px,2.4vw,34px)] leading-[1.3] text-[color:var(--ink-2)] mt-5 mb-0">
              {c.tagline}
            </p>
          </Reveal>

          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-mono text-[15px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[58ch] mt-7 mb-0">
              {c.shortDescription}
            </p>
          </Reveal>

          <Reveal variant="up" {...MOTION.page.cta}>
            <div className="flex items-center gap-[18px] mt-[30px] flex-wrap">
              <span
                className="chip"
                style={{ color: plugin.accent, borderColor: plugin.accent }}
              >
                {c.status}
              </span>
              <a href="#notify" className="link-ink">
                <span>{c.notifyLink}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- the interface, as it stands today ---------- */}
      <section className="px-[3.2vw] pt-8 pb-16">
        <Reveal variant="up" {...MOTION.section.image}>
          <div
            className="relative w-[min(1306px,96%)] mx-auto overflow-hidden rounded-[10px] border border-hairline"
            style={{
              aspectRatio: "1306/713",
              background: "linear-gradient(120deg, #EFDCC0, #E4C9A6)",
              boxShadow: "0 14px 34px rgba(42,23,30,0.16)",
            }}
          >
            <img
              src={plugin.screenshot}
              alt={`${plugin.name} plugin interface`}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <p className="text-center font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-4)] mt-4 mb-0">
            {c.screenshotCaption}
          </p>
        </Reveal>
      </section>

      {/* ---------- what it does ---------- */}
      <LabelledSection label={c.featuresEyebrow} className="pt-6 pb-[72px]" labelPad="20px">
        <div className="max-w-[820px]">
          {c.features.map((f, i) => (
            <Reveal
              key={i}
              variant="up"
              duration={MOTION.duration.base}
              delay={i * MOTION.stagger.list}
              className="grid grid-cols-[48px_1fr] gap-7 border-t border-hairline py-6"
            >
              <span
                className="font-mono font-semibold text-[12px] tabular-nums pt-0.5"
                style={{ color: plugin.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[15.5px] leading-[1.65] tracking-[0.015em] text-[color:var(--ink)]">
                {f}
              </span>
            </Reveal>
          ))}
        </div>
      </LabelledSection>

      {/* ---------- the list gets it first ---------- */}
      <NewsletterSignup id="notify" subline={c.notifySubline} />
    </SiteLayout>
  );
};

export default Fiction;
