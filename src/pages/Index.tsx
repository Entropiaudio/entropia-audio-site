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
      <section
        className="relative w-full overflow-hidden min-h-[620px] md:min-h-0 md:aspect-[1672/941] bg-cover bg-[position:20%_center] md:bg-center"
        style={{ backgroundImage: "url(/art/hero-collage.webp)" }}
      >
        <div className="relative z-[4] px-[3.2vw] pt-[150px] pb-24 md:p-0 md:absolute md:left-[12%] md:top-[26.5%] md:max-w-[62%]">
          <Reveal variant="up" {...MOTION.page.headline1}>
            <h1
              className="font-serif-display text-[clamp(46px,7vw,132px)] leading-[1.02] m-0"
              style={{ color: "#2A161F" }}
            >
              {c.headline}
            </h1>
          </Reveal>

          <Reveal variant="up" {...MOTION.page.headline2}>
            <div
              className="h-0.5 bg-[color:var(--accent-raw)] ml-[3px]"
              style={{
                width: "clamp(40px,3.6vw,68px)",
                marginTop: "clamp(18px,2.2vw,42px)",
                marginBottom: "clamp(13px,1.6vw,30px)",
              }}
            />
          </Reveal>

          <Reveal variant="up" {...MOTION.page.body0}>
            <p
              className="font-editorial text-[clamp(16px,1.66vw,32px)] tracking-[0.004em] m-0"
              style={{ fontWeight: 420, color: "rgba(42,23,30,0.85)" }}
            >
              {c.subline}
            </p>
          </Reveal>

          <Reveal variant="up" {...MOTION.page.cta}>
            <div style={{ marginTop: "clamp(20px,2.4vw,46px)" }}>
              <a href="#plugins" className="hero-cta">
                {c.heroCta}
                <span aria-hidden="true" className="font-mono text-[color:var(--accent-raw)]">
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
        className="relative z-[6] -mt-[5.2vw]"
        style={{ filter: "drop-shadow(0 -10px 26px rgba(42,23,30,0.20))" }}
      >
        <div
          className="bg-paper"
          style={{
            clipPath: "polygon(0 5vw, 100% 0, 100% 100%, 0 100%)",
            padding: "calc(5vw + 48px) 3.2vw 56px",
          }}
        >
          <Reveal variant="up" {...MOTION.section.eyebrow}>
            <div className="flex items-baseline gap-6 mb-1.5">
              <div>
                <div className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-raw)] mb-2.5">
                  {c.pluginsEyebrow}
                </div>
                <h2 className="font-serif-display text-[clamp(34px,3.2vw,58px)] tracking-[-0.01em] text-[color:var(--ink)] m-0">
                  {c.pluginsHeadline}
                </h2>
              </div>
              <div
                className="flex-1 h-px self-center mt-[34px]"
                style={{
                  background: "linear-gradient(90deg, rgba(42,23,30,0.3), transparent)",
                }}
              />
            </div>
          </Reveal>

          <div className="grid gap-[22px] mt-[30px] max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            {plugins.map((p, i) => (
              <Reveal
                key={p.slug}
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

      {/* ---------- three lines from people who ran it ---------- */}
      <section className="relative px-[3.2vw] pt-[34px] pb-[62px] grid gap-[22px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {c.quotes.map((q, i) => (
          <Reveal
            key={i}
            variant="up"
            duration={MOTION.duration.base}
            delay={i * MOTION.stagger.body}
            as="blockquote"
            className="border-l-2 border-[color:var(--accent-raw)] pl-4 py-1 m-0"
          >
            <p className="font-editorial italic text-[15.5px] leading-[1.6] text-[color:var(--ink)] m-0 mb-2">
              “{q.body}”
            </p>
            <cite className="not-italic font-mono font-semibold text-[9px] uppercase tracking-[0.14em] text-[color:var(--ink-3)]">
              {q.source}
            </cite>
          </Reveal>
        ))}
      </section>

      {/* ---------- the approach: the tan ground, torn in at the pitch ---------- */}
      <section
        className="relative diag-band-top"
        style={{
          background: "var(--tan)",
          padding: "calc(3vw + 52px) 3.2vw 150px",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute right-[9%] top-0 bottom-0 w-[88px] opacity-55 pointer-events-none"
          style={{
            transform: "skewX(-12deg)",
            backgroundImage:
              "repeating-linear-gradient(102deg, rgba(184,78,29,0.34) 0 1.5px, transparent 1.5px 7px)",
          }}
        />
        <Reveal variant="up" {...MOTION.section.eyebrow}>
          <div className="font-mono font-semibold text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-deep)] mb-[34px]">
            {c.approachEyebrow}
          </div>
        </Reveal>
        <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {c.approach.map((a, i) => (
            <Reveal
              key={i}
              variant="up"
              duration={MOTION.duration.base}
              delay={MOTION.section.body.delay + i * MOTION.stagger.body}
            >
              <div className="font-mono font-semibold text-[10px] tracking-[0.14em] text-[color:var(--pop)] mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-editorial italic text-[20px] text-[color:var(--ink)] mb-2.5">
                {a.heading}
              </h3>
              <p
                className="font-mono text-[13.5px] tracking-[0.015em] leading-[1.65] m-0"
                style={{ color: "rgba(42,23,30,0.78)" }}
              >
                {a.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
