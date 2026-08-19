import { useLocation } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import InkButton from "@/components/InkButton";
import Reveal from "@/components/motion/Reveal";
import { MOTION } from "@/components/motion/timing";

const NotFound = () => {
  usePageTitle("notFound");
  const location = useLocation();

  return (
    <SiteLayout>
      <section data-ink-anchor="404 body" className="relative overflow-hidden px-[3.2vw] pt-[90px] pb-[140px] min-h-[60vh]">
        {/* one rule crossing the field, a hair off the pitch */}
        <div
          aria-hidden="true"
          className="absolute left-[-2%] right-[-2%] top-[76%] h-px opacity-60 pointer-events-none"
          style={{ background: "var(--accent-raw)", transform: "rotate(-2.5deg)" }}
        />
        <div className="max-w-[920px]">
          <h1 className="m-0">
            <Reveal
              as="span"
              variant="up"
              className="block font-serif-display text-[clamp(64px,10vw,136px)] leading-[0.92] text-[color:var(--ink)]"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.instant}
            >
              not found.
            </Reveal>
            <Reveal
              as="span"
              variant="up"
              className="block font-editorial italic text-[clamp(24px,3.6vw,44px)] leading-[1.2] text-[color:var(--ink-2)] mt-4"
              delay={MOTION.page.headline2.delay}
              duration={MOTION.duration.instant}
            >
              or not here yet.
            </Reveal>
          </h1>
          <Reveal variant="up" {...MOTION.page.body0}>
            <p className="font-mono text-fluid-15.5 leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[48ch] mt-11 mb-0">
              the page at{" "}
              <span className="text-[color:var(--ink)] selectable">{location.pathname}</span>{" "}
              doesn&apos;t exist. the chaos engine may have randomized the URL.
            </p>
          </Reveal>
          <Reveal variant="up" {...MOTION.page.cta}>
            <div className="mt-9">
              <InkButton to="/" size="lg" magnetic trailing="→">
                back home
              </InkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
