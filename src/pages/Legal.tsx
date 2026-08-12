import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";
import { copy } from "@/copy";

type Kind = "eula" | "privacy";

const tabs: { kind: Kind; to: string; label: string }[] = [
  { kind: "eula", to: "/legal/eula", label: "eula" },
  { kind: "privacy", to: "/legal/privacy", label: "privacy" },
];

const Legal = ({ kind }: { kind: Kind }) => {
  usePageTitle(kind);
  const c = copy.legal[kind];

  return (
    <SiteLayout>
      <section className="relative px-[3.2vw] pt-[84px] pb-[110px]">
        <div className="max-w-[760px]">
          <div className="flex gap-[18px] mb-8">
            {tabs.map((t) => (
              <Link
                key={t.kind}
                to={t.to}
                className="font-mono font-semibold text-[11px] uppercase tracking-[0.18em] pb-1 transition-colors duration-[120ms] ease-editorial"
                style={
                  t.kind === kind
                    ? { color: "var(--ink)", borderBottom: "1px solid var(--ink)" }
                    : { color: "var(--ink-3)", borderBottom: "1px solid transparent" }
                }
              >
                {t.label}
              </Link>
            ))}
          </div>

          <h1
            className="font-editorial italic text-[clamp(34px,4.4vw,58px)] leading-[1.05] tracking-[-0.015em] text-[color:var(--ink)] m-0 mb-3.5"
            style={{ fontWeight: 470 }}
          >
            <Reveal
              as="span"
              variant="up"
              className="inline-block"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              {c.title}
            </Reveal>
          </h1>

          <Reveal variant="up" delay={MOTION.page.headline2.delay} duration={MOTION.duration.base}>
            <p className="font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-3)] m-0 mb-7">
              {c.lastUpdated}
            </p>
          </Reveal>

          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-mono text-[15px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[62ch] m-0 mb-7">
              {c.intro}
            </p>
          </Reveal>

          {c.sections.map((s, i) => (
            <Reveal
              key={i}
              variant="up"
              duration={MOTION.duration.base}
              delay={i * MOTION.stagger.list}
              as="article"
              className="rule-top-fade py-6"
            >
              <h2 className="font-editorial italic text-[19px] text-[color:var(--ink)] mb-3">
                {s.heading}
              </h2>
              <p className="font-mono text-[14px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[66ch] m-0">
                {s.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Legal;
