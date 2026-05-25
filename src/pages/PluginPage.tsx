import { useParams, Navigate, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import PluginScreenshot from "@/components/PluginScreenshot";
import AudioDemo from "@/components/AudioDemo";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";
import { useParallax } from "@/hooks/useScrollMotion";
import { getPlugin } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { copy } from "@/copy";

const AlternatingSection = ({
  heading,
  body,
  index,
  total,
  pluginName,
  screenshot,
}: {
  heading: string;
  body: string;
  index: number;
  total: number;
  pluginName: string;
  screenshot?: string;
}) => {
  const reversed = index % 2 === 1;
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(28);
  return (
    <article
      className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center py-24 md:py-32 border-t border-hairline ${
        reversed ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <Reveal
        variant="up"
        {...MOTION.section.image}
        className={`md:col-span-6 hover-zoom ${reversed ? "md:col-start-7" : ""}`}
      >
        <div
          ref={parallaxRef}
          style={{ transform: `translate3d(0, ${offset.toFixed(2)}px, 0)` }}
        >
          <PluginScreenshot
            name={pluginName}
            ratio="wide"
            bare
            src={screenshot}
            fit="contain"
            alt={`${pluginName} ${heading}`}
          />
        </div>
      </Reveal>
      <div className={`md:col-span-5 ${reversed ? "md:col-start-2" : "md:col-start-8"}`}>
        <Reveal variant="up" {...MOTION.section.eyebrow}>
          <Eyebrow className="mb-6">
            {String(index + 1).padStart(2, "0")} / {total.toString().padStart(2, "0")}
          </Eyebrow>
          <h3 className="font-display font-light text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em] mb-8">
            {heading}
          </h3>
        </Reveal>
        <Reveal variant="up" {...MOTION.section.headline}>
          <p className="font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[42ch]">
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

  if (!plugin) return <Navigate to="/" replace />;

  const c = copy.chaosverb;
  const onSale = plugin.regularPrice > plugin.price;

  const addToCart = (license: "perpetual" | "rent-to-own", goToCart = false) => {
    add({ slug: plugin.slug, name: plugin.name, price: plugin.price, license });
    if (goToCart) {
      navigate("/cart");
    } else {
      toast({ title: copy.shared.addedToCart(plugin.name), description: license });
    }
  };

  return (
    <SiteLayout>
      {/* ---------- sticky CTA strip ---------- */}
      <div className="sticky top-20 z-30 bg-[color:var(--bg)]/85 backdrop-blur-md border-b border-hairline">
        <div className="max-w-wide mx-auto px-6 md:px-10 h-14 flex items-center justify-between gap-4">
          <span className="hidden md:inline text-[12px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-primary)]">
            {plugin.name}
          </span>
          <div className="flex-1 md:flex-none flex items-baseline justify-between md:justify-end gap-5 md:gap-8 whitespace-nowrap">
            <a
              href="#try"
              className="link-draw text-[12px] md:text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
            >
              {c.ctaTry}
            </a>
            <MagneticLink
              as="button"
              type="button"
              strength={5}
              onClick={() => addToCart("perpetual", true)}
              className="group inline-flex items-baseline gap-2 text-[12px] md:text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial tabular-nums"
            >
              <span className="link-draw pb-1">
                {c.ctaBuy} · ${plugin.price}
              </span>
              {onSale && (
                <span className="line-through text-[11px] text-[color:var(--text-tertiary)]">
                  ${plugin.regularPrice}
                </span>
              )}
            </MagneticLink>
          </div>
        </div>
      </div>

      {/* ---------- product hero ---------- */}
      <Section pad="lg">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16">
            <Reveal variant="up" {...MOTION.page.eyebrow}>
              <Eyebrow className="mb-12">
                // {plugin.name} · v{plugin.version}
              </Eyebrow>
            </Reveal>
            <Reveal
              variant="up"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.image}
              className="max-w-[1080px] hover-zoom block"
            >
              <PluginScreenshot
                name={plugin.name}
                ratio="hero"
                src={plugin.screenshot}
                fit="contain"
                alt={`${plugin.name} plugin interface`}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- name + tagline ---------- */}
      <Section pad="lg">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{plugin.name}</Eyebrow>
            </Reveal>
            <div className="md:col-span-8">
              <h1 className="font-display font-light leading-[1.0] tracking-[-0.02em] text-[44px] md:text-[64px] lg:text-[80px]">
                <RevealWords
                  as="span"
                  className="font-editorial italic font-normal tracking-[-0.015em]"
                  {...MOTION.section.headline}
                  stagger={MOTION.stagger.word}
                >
                  {plugin.tagline}
                </RevealWords>
              </h1>
              <Reveal variant="up" {...MOTION.section.body}>
                <p className="mt-10 font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[58ch]">
                  {plugin.shortDescription}
                </p>
              </Reveal>

              <Reveal variant="up" {...MOTION.section.cta}>
                <div className="mt-10 flex items-baseline gap-6 font-mono text-[13px] tabular-nums">
                  <span className="text-[color:var(--text-primary)]">${plugin.price}</span>
                  {onSale && (
                    <>
                      <span className="line-through text-[color:var(--text-tertiary)]">
                        ${plugin.regularPrice}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent-raw)]">
                        {c.saleBadge}
                      </span>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- numbered features ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16 max-w-[880px]">
            <ul>
              {plugin.features.map((f, i) => (
                <Reveal
                  key={i}
                  variant="up"
                  duration={MOTION.duration.base}
                  delay={i * MOTION.stagger.list}
                  as="li"
                  className="grid grid-cols-[3rem,1fr] gap-6 md:gap-10 font-sans font-normal text-[17px] md:text-[18px] leading-[1.65] tracking-[0.005em] border-t border-hairline py-7"
                >
                  <span className="font-mono text-[12px] tabular-nums text-[color:var(--text-tertiary)] pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[color:var(--text-primary)]">{f}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---------- alternating image / text ---------- */}
      <Container width="wide">
        {plugin.sections.map((section, i) => (
          <AlternatingSection
            key={i}
            heading={section.heading}
            body={section.body}
            index={i}
            total={plugin.sections.length}
            pluginName={plugin.name}
            screenshot={plugin.screenshot}
          />
        ))}
      </Container>

      {/* ---------- audio demos ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{c.listenEyebrow}</Eyebrow>
            </Reveal>
            <div className="md:col-span-8">
              <Reveal variant="up" {...MOTION.section.headline}>
                <h3 className="font-display font-light text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em] mb-14">
                  <span className="font-editorial italic font-normal tracking-[-0.015em]">
                    {c.listenHeadline}
                  </span>
                </h3>
              </Reveal>
              <div>
                {plugin.demos.map((d, i) => (
                  <Reveal
                    key={d.slug}
                    variant="up"
                    duration={MOTION.duration.base}
                    delay={MOTION.section.body.delay + i * MOTION.stagger.body}
                  >
                    <AudioDemo demo={d} index={i} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- specs ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{c.specsEyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="up" {...MOTION.section.headline} className="md:col-span-8">
              <table className="w-full text-[15px]">
                <tbody>
                  {plugin.specs.map((spec) => (
                    <tr key={spec.label} className="border-t border-hairline">
                      <td className="py-6 pr-6 text-[color:var(--text-tertiary)] w-1/3 align-top font-sans font-medium text-[13px] uppercase tracking-[0.06em]">
                        {spec.label}
                      </td>
                      <td className="py-6 font-mono text-[13px] text-[color:var(--text-primary)]">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- try / download ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide" id="try">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal variant="up" {...MOTION.section.eyebrow} className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{c.tryEyebrow}</Eyebrow>
            </Reveal>
            <div className="md:col-span-8">
              <Reveal variant="up" {...MOTION.section.headline}>
                <h3 className="font-display font-light text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em] mb-8">
                  <span className="font-editorial italic font-normal tracking-[-0.015em]">
                    {c.tryHeadline}
                  </span>
                </h3>
              </Reveal>
              <Reveal variant="up" {...MOTION.section.body}>
                <p className="font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch] mb-12">
                  {c.trySubline}
                </p>
              </Reveal>
              <Reveal variant="up" {...MOTION.section.cta}>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                  {plugin.downloadMacUrl ? (
                    <MagneticLink
                      as="a"
                      href={plugin.downloadMacUrl}
                      strength={6}
                      className="accent-glow group inline-flex items-baseline gap-2 px-6 py-3.5 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)]"
                    >
                      <span>{c.downloadMac}</span>
                      <span aria-hidden="true" className="transition-transform duration-[600ms] ease-editorial group-hover:translate-y-0.5">↓</span>
                    </MagneticLink>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="installer coming soon"
                      className="inline-flex items-baseline gap-2 px-6 py-3.5 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] border border-[color:var(--border-soft)] opacity-60 cursor-not-allowed select-none"
                    >
                      <span>{c.downloadMac}</span>
                      <span aria-hidden="true" className="text-[10px]">soon</span>
                    </span>
                  )}
                  {plugin.downloadWinUrl ? (
                    <MagneticLink
                      as="a"
                      href={plugin.downloadWinUrl}
                      strength={6}
                      className="accent-glow group inline-flex items-baseline gap-2 px-6 py-3.5 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)]"
                    >
                      <span>{c.downloadWin}</span>
                      <span aria-hidden="true" className="transition-transform duration-[600ms] ease-editorial group-hover:translate-y-0.5">↓</span>
                    </MagneticLink>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="installer coming soon"
                      className="inline-flex items-baseline gap-2 px-6 py-3.5 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] border border-[color:var(--border-soft)] opacity-60 cursor-not-allowed select-none"
                    >
                      <span>{c.downloadWin}</span>
                      <span aria-hidden="true" className="text-[10px]">soon</span>
                    </span>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default PluginPage;
