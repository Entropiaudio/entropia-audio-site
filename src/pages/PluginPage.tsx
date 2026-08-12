import { useParams, Navigate, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import AudioDemo from "@/components/AudioDemo";
import InkButton from "@/components/InkButton";
import LabelledSection from "@/components/primitives/LabelledSection";
import PluginShot from "@/components/primitives/PluginShot";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import { MOTION } from "@/components/motion/timing";
import { useParallax } from "@/hooks/useScrollMotion";
import { usePluginPricing } from "@/hooks/usePluginPricing";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getPlugin } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { copy } from "@/copy";
import { Moonbase } from "@/lib/moonbase";

const StorySection = ({
  heading,
  body,
  index,
  pluginName,
  screenshot,
  screenshotSize,
}: {
  heading: string;
  body: string;
  index: number;
  pluginName: string;
  screenshot: string;
  screenshotSize?: { w: number; h: number };
}) => {
  const reversed = index % 2 === 1;
  const parallaxRef = useParallax<HTMLDivElement>(24);
  return (
    <article className="grid gap-10 items-center px-[3.2vw] py-14 rule-top-fade grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
      <Reveal
        variant="up"
        {...MOTION.section.image}
        className={`hover-zoom ${reversed ? "md:order-2" : ""}`}
      >
        <div ref={parallaxRef}>
          <PluginShot
            src={screenshot}
            size={screenshotSize}
            alt={`${pluginName}, ${heading}`}
          />
        </div>
      </Reveal>
      <div className={reversed ? "md:order-1" : ""}>
        <Reveal variant="up" {...MOTION.section.eyebrow}>
          {/* h2: these panels are peers of "listen" and "specifications", not
              children of anything — the page used to jump h1 → h3 here */}
          <h2 className="font-serif-display text-[clamp(28px,2.6vw,42px)] leading-[1.05] text-[color:var(--ink)] mb-5">
            {heading}
          </h2>
        </Reveal>
        <Reveal variant="up" {...MOTION.section.body}>
          <p className="font-mono text-[15px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[44ch] m-0">
            {body}
          </p>
        </Reveal>
      </div>
    </article>
  );
};

const PluginPage = () => {
  const { slug } = useParams();
  const plugin = slug ? getPlugin(slug) : undefined;
  const { add } = useCart();
  const navigate = useNavigate();
  // Hooks must run before the early return below; fall back to safe zeros when
  // the route doesn't resolve to a plugin (the result is discarded anyway).
  const pricing = usePluginPricing(plugin?.slug ?? "", {
    price: plugin?.price ?? 0,
    regularPrice: plugin?.regularPrice ?? 0,
  });
  usePageTitle(plugin?.slug);

  // This is the storefront layout. Unreleased plugins have their own routes
  // (see App.tsx) and never reach it; if one somehow does, go home rather
  // than render a page with a price and a buy button on it.
  if (!plugin || plugin.status !== "released") return <Navigate to="/" replace />;

  const c = copy.chaosverb;
  const onSale = pricing.regularPrice > pricing.price;

  const addToCart = (goToCart = false) => {
    add({ slug: plugin.slug, name: plugin.name, price: pricing.price, license: "perpetual" });
    if (goToCart) {
      navigate("/cart");
    } else {
      toast({ title: copy.shared.addedToCart(plugin.name), description: "perpetual" });
    }
  };

  return (
    <SiteLayout>
      {/* ---------- sticky buy strip — the one thing on the site that sticks ---------- */}
      <div
        className="sticky top-0 z-30 border-b border-hairline backdrop-blur-md"
        style={{
          background: "rgba(242, 225, 199, 0.97)",
          boxShadow: "0 4px 14px rgba(42,23,30,0.06)",
        }}
      >
        <div className="flex items-center gap-3.5 px-[3.2vw] py-2.5">
          <span className="hidden sm:inline font-mono font-semibold text-[12px] uppercase tracking-[0.18em] text-[color:var(--ink)]">
            {plugin.name}
          </span>
          <span className="flex-1" />
          <InkButton
            variant="ghost"
            size="sm"
            onClick={() => Moonbase.download_product({ product_id: plugin.slug })}
          >
            {c.ctaTry}
          </InkButton>
          <InkButton size="sm" magnetic onClick={() => addToCart(true)}>
            <span className="tabular-nums">
              {c.ctaBuy} · ${pricing.price}
            </span>
          </InkButton>
          {onSale && (
            <span className="font-mono text-[10px] tabular-nums line-through text-[color:var(--ink-3)]">
              ${pricing.regularPrice}
            </span>
          )}
        </div>
      </div>

      {/* ---------- the UI, front and centre ---------- */}
      <section
        data-ink-anchor="Product hero"
        className="relative px-[3.2vw] pt-14 pb-[72px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 24%, var(--parchment-hi) 0%, var(--paper) 46%, var(--tan) 100%)",
        }}
      >
        {/* The UI plate sweeps in behind the brand-pitch wipe. The width cap
            lives on an anchor div OUTSIDE the Reveal: ink pinned to the plate
            must track this exact box (the section keeps growing after the
            plate stops at 1040px), and it can't live inside the Reveal — the
            wipe leaves a clip-path on its children, which would isolate the
            marks' blending into a grey rectangle. */}
        <div className="relative w-[min(1040px,96%)] mx-auto" data-ink-anchor="Product shot">
          <Reveal variant="wipe" delay={MOTION.page.headline1.delay} duration={MOTION.duration.image}>
            <PluginShot
              src={plugin.screenshot}
              size={plugin.screenshotSize}
              alt={`${plugin.name} plugin interface`}
              elevation="hero"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- name, pitch, price ---------- */}
      {/* labelAs="div": this block opens on the page's h1, and the margin label
          only repeats the product name — it must not outrank it. */}
      <LabelledSection
        label={plugin.name}
        className="pt-16 pb-14"
        labelPad="14px"
        labelAs="div"
      >
        <div className="max-w-[820px]">
          <h1
            className="text-[clamp(38px,4.8vw,68px)] leading-[1.08] tracking-[-0.015em] text-[color:var(--ink)] m-0"
            style={{ fontWeight: 470 }}
          >
            <RevealWords
              as="span"
              className="font-editorial italic"
              {...MOTION.section.headline}
              stagger={MOTION.stagger.word}
            >
              {plugin.tagline}
            </RevealWords>
          </h1>
          <Reveal variant="up" {...MOTION.section.body}>
            <p className="mt-6 font-mono text-[15px] leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[60ch]">
              {plugin.shortDescription}
            </p>
          </Reveal>
          <Reveal variant="up" {...MOTION.section.cta}>
            <div key={pricing.price} className="state-fade mt-[30px] flex items-baseline gap-5">
              <span className="font-mono font-semibold text-[22px] tabular-nums text-[color:var(--ink)]">
                ${pricing.price}
              </span>
              {onSale && (
                <>
                  <span className="font-mono text-[14px] tabular-nums line-through text-[color:var(--ink-3)]">
                    ${pricing.regularPrice}
                  </span>
                  <span className="font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-ink)]">
                    {c.saleBadge}
                  </span>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </LabelledSection>

      {/* ---------- what it does ---------- */}
      <section className="px-[3.2vw] pt-6 pb-16">
        <ul className="max-w-[880px] m-0 p-0 list-none md:ml-[max(0px,calc((100%-880px)*0.22))]">
          {plugin.features.map((f, i) => (
            <Reveal
              key={i}
              variant="up"
              duration={MOTION.duration.base}
              delay={i * MOTION.stagger.list}
              as="li"
              className="grid grid-cols-[48px_1fr] gap-7 rule-top-fade py-6"
            >
              <span className="font-mono font-semibold text-[12px] tabular-nums pt-0.5 text-[color:var(--accent-ink)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[15.5px] leading-[1.65] tracking-[0.015em] text-[color:var(--ink)]">
                {f}
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- the two stories ---------- */}
      {(plugin.sections ?? []).map((section, i) => (
        <StorySection
          key={i}
          heading={section.heading}
          body={section.body}
          index={i}
          pluginName={plugin.name}
          // the section's own shot when it has one, the main plate otherwise
          screenshot={section.shot ?? plugin.screenshot}
          screenshotSize={section.shot ? section.shotSize : plugin.screenshotSize}
        />
      ))}

      {/* ---------- listen: the tan ground ---------- */}
      <div
        data-ink-anchor="Listen"
        className="relative diag-band mt-2"
        style={{
          background: "var(--tan)",
          paddingTop: "calc(3vw + 56px)",
          paddingBottom: "calc(3vw + 64px)",
        }}
      >
        <LabelledSection label={c.listenEyebrow} labelTone="copper" labelPad="10px">
          <div className="max-w-[780px]">
            <Reveal variant="up" {...MOTION.section.headline}>
              <h3
                className="font-editorial italic text-[clamp(30px,3.2vw,48px)] leading-[1.05] text-[color:var(--ink)] mb-4"
                style={{ fontWeight: 470 }}
              >
                {c.listenHeadline}
              </h3>
            </Reveal>
            {plugin.demos.map((d, i) => (
              <Reveal
                key={d.slug}
                variant="up"
                duration={MOTION.duration.base}
                delay={MOTION.section.body.delay + i * MOTION.stagger.body}
              >
                <AudioDemo demo={d} />
              </Reveal>
            ))}
          </div>
        </LabelledSection>
      </div>

      {/* ---------- specifications ---------- */}
      <LabelledSection label={c.specsEyebrow} className="py-16">
        <table className="w-full max-w-[780px] border-collapse">
          <tbody>
            {(plugin.specs ?? []).map((spec, i, all) => (
              <tr
                key={spec.label}
                className={i === all.length - 1 ? "rule-row-both-fade" : "rule-row-top-fade"}
              >
                <td className="py-5 pr-5 align-top w-1/3 font-mono font-semibold text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-3)]">
                  {spec.label}
                </td>
                <td className="py-5 font-mono text-[14px] text-[color:var(--ink)]">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LabelledSection>

      {/* ---------- the trial ---------- */}
      <LabelledSection id="try" label={c.tryEyebrow} className="pt-6 pb-[90px] scroll-mt-16">
        <div className="max-w-[780px]">
          <div className="relative overflow-hidden corner-cut rounded-lg border border-[color:var(--border-subtle)] bg-parchment-hi shadow-card px-8 py-10 md:px-12 md:py-11">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(102deg, rgba(194,90,30,0.10) 0 1.5px, transparent 1.5px 9px)",
              }}
            />
            <div className="relative">
              <Reveal variant="up" {...MOTION.section.headline}>
                <h3
                  className="font-editorial italic text-[clamp(30px,3.2vw,46px)] leading-[1.05] text-[color:var(--ink)] mb-4"
                  style={{ fontWeight: 470 }}
                >
                  {c.tryHeadline}
                </h3>
              </Reveal>
              <Reveal variant="up" {...MOTION.section.body}>
                <p className="font-mono text-[15px] leading-[1.7] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[52ch] mb-7">
                  {c.trySubline}
                </p>
              </Reveal>
              <Reveal variant="up" {...MOTION.section.cta}>
                <InkButton
                  size="lg"
                  magnetic
                  trailing="↓"
                  onClick={() => Moonbase.download_product({ product_id: plugin.slug })}
                >
                  {c.download}
                </InkButton>
              </Reveal>
            </div>
          </div>
        </div>
      </LabelledSection>
    </SiteLayout>
  );
};

export default PluginPage;
