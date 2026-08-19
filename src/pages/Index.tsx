import SiteLayout from "@/components/SiteLayout";
import PluginCard from "@/components/PluginCard";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { plugins } from "@/data/plugins";
import { copy } from "@/copy";

const Index = () => {
  const c = copy.home;

  return (
    <SiteLayout backdrop={false} overlay>
      {/* ---------- hero: the painted collage, type sitting in its clear field ---------- */}
      {/* Narrow screens crop the 16:9 collage hard, so they hold the left third
          — the torn cream field the type was composed to sit in — instead of
          the middle, where the orange wedge and the ink splatter live. */}
      <section className="relative w-full overflow-hidden min-h-[620px] md:min-h-0 md:aspect-[1672/941]">
        {/* the painting on its own layer so it can settle + breathe (hero-art,
            index.css) without carrying the type along */}
        <div
          aria-hidden="true"
          className="hero-art absolute inset-0 bg-cover bg-[position:20%_center] md:bg-center"
          style={{ backgroundImage: "url(/art/hero-collage.webp)" }}
        />
        {/* The type is composed INTO the painting — it sits in the collage's
            clear field, positioned and sized as fractions of it. So every
            clamp here shares the painting's own scale (vw), and the caps are
            set where the whole poster stops being plausible (~3440w), not at
            laptop width: capping the type early while the painting kept
            growing is exactly what warped the hero on big screens. */}
        <div className="relative z-[4] px-[3.2vw] pt-[150px] pb-24 md:p-0 md:absolute md:left-[12%] md:top-[26.5%] md:max-w-[62%]">
          <Reveal variant="up" {...MOTION.page.headline1}>
            <h1
              className="font-serif-display text-[clamp(46px,7vw,240px)] leading-[1.02] m-0"
              style={{ color: "#2A161F" }}
            >
              {c.headline}
            </h1>
          </Reveal>

          {/* the copper stroke draws itself instead of fading up */}
          <Reveal variant="draw" delay={MOTION.page.headline2.delay} duration={MOTION.duration.draw}>
            <div
              className="h-0.5 bg-[color:var(--accent-raw)] ml-[3px]"
              style={{
                width: "clamp(40px,3.6vw,124px)",
                marginTop: "clamp(18px,2.2vw,76px)",
                marginBottom: "clamp(13px,1.6vw,55px)",
              }}
            />
          </Reveal>

          <Reveal variant="up" {...MOTION.page.body0}>
            <p
              className="font-editorial text-[clamp(16px,1.66vw,57px)] tracking-[0.004em] m-0"
              style={{ fontWeight: 420, color: "rgba(42,23,30,0.85)" }}
            >
              {c.subline}
            </p>
          </Reveal>

          <Reveal variant="up" {...MOTION.page.cta}>
            <div style={{ marginTop: "clamp(20px,2.4vw,83px)" }}>
              <a href="#plugins" className="hero-cta">
                {c.heroCta}
                <span aria-hidden="true" className="font-mono text-[color:var(--accent-ink)]">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- the plugins: a paper sheet torn across the collage ---------- */}
      <div
        id="plugins"
        data-ink-anchor="The plugins"
        className="relative z-[6] -mt-[5.2vw]"
        style={{
          filter: "drop-shadow(0 -10px 26px rgba(42,23,30,0.20))",
          // The shadow exists to lift the sheet's torn TOP edge off the
          // collage, but drop-shadow silhouettes the whole element — so it
          // also throws a 16px smudge (26px blur less the 10px offset) below
          // the sheet's straight bottom edge, which reads as grey dirt on the
          // paper underneath. clip-path runs after filter in the paint order,
          // so this cuts the downward spill dead while the negative top inset
          // lets the wanted shadow through.
          clipPath: "inset(-40px 0 0 0)",
        }}
      >
        <div
          className="bg-paper"
          style={{
            clipPath: "polygon(0 5vw, 100% 0, 100% 100%, 0 100%)",
            padding: "calc(5vw + 48px) 3.2vw calc(3vw + 62px)",
          }}
        >
          {/* heading and cards share one centred measure, so the hairline ends
              where the cards do instead of running out to the page edge */}
          <div className="max-w-[1100px] mx-auto">
            <Reveal variant="up" {...MOTION.section.eyebrow}>
              <div className="flex items-center gap-6 mb-1.5">
                <h2 className="font-serif-display text-[clamp(34px,3.2vw,58px)] tracking-[-0.01em] text-[color:var(--ink)] m-0">
                  {c.pluginsHeadline}
                </h2>
                {/* the hairline runs from the headline's optical middle now
                    that no eyebrow sits above it */}
                <div
                  className="flex-1 h-px mt-[10px]"
                  style={{ background: "var(--divider-fade)" }}
                />
              </div>
            </Reveal>

            <div className="grid gap-[22px] mt-[30px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
              {plugins.map((p, i) => (
                <Reveal
                  key={p.slug}
                  className="h-full"
                  variant="up"
                  duration={MOTION.duration.base}
                  delay={MOTION.section.body.delay + i * MOTION.stagger.body}
                >
                  <PluginCard plugin={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

    </SiteLayout>
  );
};

export default Index;
