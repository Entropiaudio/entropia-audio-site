import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import NewsletterSignup from "@/components/NewsletterSignup";
import InkButton from "@/components/InkButton";
import LabelledSection from "@/components/primitives/LabelledSection";
import PluginShot from "@/components/primitives/PluginShot";
import SkinSwitch from "@/components/primitives/SkinSwitch";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import { MOTION } from "@/components/motion/timing";
import { useParallax } from "@/hooks/useScrollMotion";
import { getPlugin, plateFor } from "@/data/plugins";
import { usePluginSkin } from "@/lib/pluginSkin";
import { copy } from "@/copy";

/**
 * The preview page for a plugin that isn't out yet — Fiction, today. It
 * sells the idea and takes an email. The layout mirrors Chaosverb's:
 * sticky strip, the interface front and centre, name + pitch, features, two
 * image/text stories, the optional tan "ways in" band, specifications — and
 * the mailing list where Chaosverb has its trial card. No price, no cart, no
 * trial anywhere.
 *
 * The plugin's signature hue (`plugin.accent`, sampled from its own UI) codes
 * the page: the h1 pitch, the solid status chips, the numerals, and the hero
 * stain — the way Chaosverb's slate blue codes its page (there the headline
 * moment is the listen band's, since that page's h1 shares a block with the
 * price). Copper stays the action voice on every product page.
 *
 * Which plugin is a prop, not a route param: each preview claims its own
 * route in App.tsx ahead of the generic storefront page, so an unreleased
 * slug can never render a price and a buy button.
 */

/** The copy blocks shaped like a preview page, by slug. */
const PREVIEW_COPY = {
  fiction: copy.fiction,
} as const;

export type PreviewSlug = keyof typeof PREVIEW_COPY;

/* One story at the Chaosverb scale: the interface on one side, the pitch on
   the other, alternating. Same markup as PluginPage's StorySection — the two
   pages must read as siblings. */
const PreviewStory = ({
  heading,
  body,
  index,
  pluginName,
  screenshot,
  screenshotSize,
  alternates,
}: {
  heading: string;
  body: string;
  index: number;
  pluginName: string;
  screenshot: string;
  screenshotSize?: { w: number; h: number };
  alternates?: readonly string[];
}) => {
  const reversed = index % 2 === 1;
  const parallaxRef = useParallax<HTMLDivElement>(24);
  return (
    <article className="px-[3.2vw] py-14 rule-top-fade">
      {/* the frame cap is the big-screen fix, mirrored from StorySection:
          uncapped, the story shots outgrew the hero plate on wide monitors.
          1320 holds the spread's balance and keeps shots under the plate. */}
      <div className="grid gap-10 items-center max-w-spread mx-auto grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        <Reveal
          variant="up"
          {...MOTION.section.image}
          className={`hover-zoom ${reversed ? "md:order-2" : ""}`}
        >
          <div ref={parallaxRef}>
            <PluginShot
              src={screenshot}
              size={screenshotSize}
              alternates={alternates}
              alt={`${pluginName}, ${heading}`}
            />
          </div>
        </Reveal>
        <div className={reversed ? "md:order-1" : ""}>
          <Reveal variant="up" {...MOTION.section.eyebrow}>
            <h2 className="font-serif-display text-[clamp(28px,2.6vw,42px)] leading-[1.05] text-[color:var(--ink)] m-0 mb-5">
              {heading}
            </h2>
          </Reveal>
          <Reveal variant="up" {...MOTION.section.body}>
            <p className="font-mono text-fluid-15 leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[44ch] m-0">
              {body}
            </p>
          </Reveal>
        </div>
      </div>
    </article>
  );
};

const PluginPreview = ({ slug }: { slug: PreviewSlug }) => {
  usePageTitle(slug);
  const c = PREVIEW_COPY[slug];
  const plugin = getPlugin(slug)!;
  const [skin] = usePluginSkin();
  const plate = plateFor(plugin, skin);

  // Optional copy blocks. The owner adds or removes these in copy.ts without
  // touching this file — an absent key hides its section, nothing more. (The
  // caption and the "three ways in" band were removed from Fiction on
  // purpose; this keeps the page standing either way.)
  const extras = c as typeof c & {
    screenshotCaption?: string;
    usesEyebrow?: string;
    uses?: readonly { heading: string; body: string }[];
  };

  // The ink marks (data/inkMarks.ts) pin to these labels, so they carry the
  // product's name: "Fiction shot".
  const anchor = (part: string) => `${plugin.name} ${part}`;

  return (
    // the page ends on the tan mailing-list band, so the plum wedge would
    // collide with it — drop the wedge, keep the fleck.
    <SiteLayout plum={false}>
      {/* ---------- sticky strip — Chaosverb's buy strip, with the notify
          action where the money would go ---------- */}
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
          {/* filled, not outlined: the status is the page's flag, solid in
              the plugin's signature hue with paper caps (6.5:1) */}
          <span
            className="chip"
            style={{ color: "var(--paper)", background: plugin.accent, borderColor: plugin.accent }}
          >
            {c.status}
          </span>
          <InkButton size="sm" magnetic href="#notify">
            {c.notifyLink}
          </InkButton>
        </div>
      </div>

      {/* ---------- the UI, front and centre ---------- */}
      <section
        data-ink-anchor={anchor("preview")}
        className="relative px-[3.2vw] pt-14 pb-16"
        style={{
          // the plugin's signature hue stains the hero — the plate bleeding
          // into its page. Two passes of the tint over the parchment radial
          // (full strength mid-field, ~2x at the corners), mirroring the
          // blue wash on Chaosverb's hero. No type sits on this ground — the
          // washed zone is safe to darken.
          background:
            `radial-gradient(ellipse at 50% 24%, transparent 26%, ${plugin.accentWash} 62%), ` +
            `radial-gradient(ellipse at 50% 24%, transparent 48%, ${plugin.accentWash} 100%), ` +
            "radial-gradient(ellipse at 50% 24%, var(--parchment-hi) 0%, var(--paper) 46%, var(--tan) 100%)",
        }}
      >
        {/* "plate row": full width but exactly plate-tall. The corner marks
            anchor here — x rides the page margins (which scale with the
            window), y rides the plate's row (which scales with the plate) —
            so they hold the plate's corners at every viewport. */}
        <div className="relative" data-ink-anchor={anchor("plate row")}>
          {/* The interface plate sweeps in behind the brand-pitch wipe. The
              width cap sits on an anchor div OUTSIDE the Reveal so ink pinned
              to the plate tracks its exact box, and doesn't inherit the wipe's
              lingering clip-path (which would isolate the marks' blending). */}
          <div className="relative w-[min(1040px,96%)] mx-auto" data-ink-anchor={anchor("shot")}>
            <Reveal
              variant="wipe"
              delay={MOTION.page.headline1.delay}
              duration={MOTION.duration.image}
            >
              <PluginShot
                src={plate.src}
                alternates={plate.alternates}
                size={plugin.screenshotSize}
                alt={`${plugin.name} plugin interface`}
                elevation="hero"
                priority
              />
            </Reveal>
          </div>
        </div>
        {/* below the plate row, so the corner marks keep their box */}
        {plugin.skins && (
          <Reveal
            variant="up"
            {...MOTION.page.cta}
            className="w-[min(1040px,96%)] mx-auto mt-5 flex justify-end"
          >
            <SkinSwitch />
          </Reveal>
        )}
        {extras.screenshotCaption && (
          <Reveal variant="up" {...MOTION.section.image}>
            <p className="text-center font-mono font-semibold text-fluid-10 uppercase tracking-[0.18em] text-[color:var(--ink-3)] mt-4 mb-0">
              {extras.screenshotCaption}
            </p>
          </Reveal>
        )}
      </section>

      {/* ---------- name, pitch, status ---------- */}
      {/* labelAs="div": this block opens on the page's h1, and the margin label
          only repeats the product name — it must not outrank it. */}
      <div data-ink-anchor={anchor("hero")}>
        <LabelledSection
          label={plugin.name}
          className="pt-16 pb-14"
          labelPad="14px"
          labelAs="div"
        >
          <div className="max-w-[820px]" data-ink-anchor={anchor("copy")}>
            {/* the page's one headline-scale signature-hue moment: the pitch
                itself speaks in the plugin's colour (ink-grade, 6.5:1 on
                paper) — Chaosverb's equivalent is its blue listen headline */}
            <h1
              className="text-[clamp(38px,4.8vw,68px)] leading-[1.08] tracking-[-0.015em] m-0"
              style={{ fontWeight: 470, color: plugin.accent }}
            >
              <RevealWords
                as="span"
                className="font-editorial italic"
                {...MOTION.section.headline}
                stagger={MOTION.stagger.word}
              >
                {c.headline}
              </RevealWords>
            </h1>
            <Reveal variant="up" {...MOTION.page.headline2}>
              <p className="font-editorial italic text-[clamp(18px,2vw,26px)] leading-[1.3] text-[color:var(--ink-2)] mt-4 mb-0">
                {c.tagline}
              </p>
            </Reveal>
            <Reveal variant="up" {...MOTION.section.body}>
              <p className="mt-6 font-mono text-fluid-15 leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[60ch]">
                {c.shortDescription}
              </p>
            </Reveal>
            <Reveal variant="up" {...MOTION.section.cta}>
              <div className="flex items-center gap-[18px] mt-[30px] flex-wrap">
                <span
                  className="chip"
                  style={{ color: "var(--paper)", background: plugin.accent, borderColor: plugin.accent }}
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
        </LabelledSection>
      </div>

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
              <span
                className="font-mono font-semibold text-fluid-15 tabular-nums"
                style={{ color: plugin.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-fluid-15.5 leading-[1.65] tracking-[0.015em] text-[color:var(--ink)]">
                {f}
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- the stories ---------- */}
      {(plugin.sections ?? []).map((section, i) => (
        <PreviewStory
          key={i}
          heading={section.heading}
          body={section.body}
          index={i}
          pluginName={plugin.name}
          // the section's own shot when it has one, the main plate (in the
          // chosen skin, flipping with the switch) otherwise
          screenshot={section.shot ?? plate.src}
          alternates={section.shot ? undefined : plate.alternates}
          screenshotSize={section.shot ? section.shotSize : plugin.screenshotSize}
        />
      ))}

      {/* ---------- ways in: the tan ground (only when copy.ts has a `uses`
          block — absent on both pages right now, on purpose) ---------- */}
      {!!extras.uses?.length && (
        <div
          data-ink-anchor={anchor("uses")}
          className="relative diag-band mt-2"
          style={{
            background: "var(--tan)",
            paddingTop: "calc(3vw + 56px)",
            paddingBottom: "calc(3vw + 64px)",
          }}
        >
          <LabelledSection
            label={extras.usesEyebrow ?? ""}
            labelTone="copper"
            labelPad="10px"
          >
            <div className="grid gap-10 max-w-[980px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {extras.uses.map((u, i) => (
                <Reveal
                  key={i}
                  variant="up"
                  duration={MOTION.duration.base}
                  delay={MOTION.section.body.delay + i * MOTION.stagger.body}
                >
                  <div
                    className="font-mono font-semibold text-fluid-10 tracking-[0.14em] mb-3"
                    style={{ color: plugin.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-editorial italic text-fluid-20 text-[color:var(--ink)] mb-2.5">
                    {u.heading}
                  </h3>
                  <p className="font-mono text-fluid-13.5 tracking-[0.015em] leading-[1.65] text-[color:var(--ink-2)] m-0">
                    {u.body}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal variant="up" {...MOTION.section.cta}>
              <div className="mt-12">
                <a href="#notify" className="link-ink">
                  <span>{c.notifyLink}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          </LabelledSection>
        </div>
      )}

      {/* ---------- specifications ---------- */}
      <LabelledSection label={c.specsEyebrow} className="py-16">
        <table className="w-full max-w-[780px] border-collapse">
          <tbody>
            {(plugin.specs ?? []).map((spec, i, all) => (
              <tr
                key={spec.label}
                className={i === all.length - 1 ? "rule-row-both-fade" : "rule-row-top-fade"}
              >
                <td className="py-5 pr-5 align-top w-1/3 font-mono font-semibold text-fluid-11 uppercase tracking-[0.14em] text-[color:var(--ink-3)]">
                  {spec.label}
                </td>
                <td className="py-5 font-mono text-fluid-14 text-[color:var(--ink)]">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LabelledSection>

      {/* ---------- the list gets it first ---------- */}
      <NewsletterSignup id="notify" subline={c.notifySubline} />
    </SiteLayout>
  );
};

export default PluginPreview;
