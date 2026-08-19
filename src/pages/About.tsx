import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import LabelledSection from "@/components/primitives/LabelledSection";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import MagneticLink from "@/components/motion/MagneticLink";
import { MOTION } from "@/components/motion/timing";
import { useParallax } from "@/hooks/useScrollMotion";
import { copy } from "@/copy";

/* Portraits live in public/team — the frames find them by first name (the
   first word of `name` in copy.ts, any capitalisation). Until a file exists,
   the img hides itself on error and the frame shows its parchment wash
   instead of a broken-image glyph.

   `pos` recrops a shot whose subject is off-centre in the source file: the
   4/5 frame shows the middle slice of a landscape photo, and Noam stands
   left of centre in his (face at ~45% across, measured), so his window
   slides to 40% to put him in the middle of the frame. Evyatar's portrait
   crop is fine at the default centre. */
const TEAM_PHOTOS: Record<string, { src: string; pos?: string }> = {
  evyatar: { src: "/team/evyatar.png" },
  noam: { src: "/team/noam.jpg", pos: "40% 50%" },
};

/* What a team entry needs to render. `line` is optional copy — an absent key
   hides its element, so each of the two can carry one or not. */
type TeamMember = {
  name: string;
  half: string;
  line?: string;
  story: readonly string[];
};

/* One of us at the story-row scale the plugin pages use: the portrait as a
   printed object on one side, the name and story on the other, the two rows
   mirrored like a book spread. The photos keep their own colour; the frame
   only grades their end points onto the site's palette: multiply against
   the parchment frame pins the whites to paper (nothing prints brighter
   than the page), and the ink `screen` layer over the print lifts the
   blacks to the plum the site writes with. Both shots sit on near-black
   backdrops, so their grounds land exactly on --ink — the portraits read
   as dark plates the way the plugin screenshots do. */
const TeamRow = ({ person, index }: { person: TeamMember; index: number }) => {
  const reversed = index % 2 === 1;
  const photo = TEAM_PHOTOS[person.name.trim().split(/\s+/)[0].toLowerCase()];
  const parallaxRef = useParallax<HTMLDivElement>(24);
  // The first row draws no rule of its own — the heading's decaying hairline
  // sits right above it, and one line there is enough. Later rows separate
  // with the same decay.
  return (
    <article className={`px-[3.2vw] py-14 ${index > 0 ? "rule-top-fade" : ""}`}>
      {/* same frame cap as the plugin pages' story rows: on wide monitors the
          uncapped grid pushed the copy a full column away from the portrait */}
      <div className="grid gap-10 md:gap-14 items-center max-w-spread mx-auto grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        <Reveal
          variant="up"
          {...MOTION.section.image}
          className={`hover-zoom ${reversed ? "md:order-2" : ""}`}
        >
          <div ref={parallaxRef}>
            {/* isolate scopes the multiply to the frame's own parchment, so the
                print never blends with the tan band behind it. Ring + shadow are
                PluginShot's row values — portraits and plates are the same kind
                of printed object. */}
            <div
              className={`relative isolate overflow-hidden rounded-lg aspect-[4/5] w-full max-w-[460px] mx-auto bg-parchment-hi ${
                reversed ? "md:ml-auto md:mr-0" : "md:mx-0"
              }`}
              style={{
                boxShadow: "inset 0 0 0 1px var(--ink-line), 0 12px 28px rgba(42, 23, 30, 0.20)",
              }}
            >
              <img
                src={photo?.src}
                alt={copy.about.portraitAlt(person.name, person.half)}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: photo?.pos }}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {/* the black-point grade: `screen` with ink can only LIFT values,
                  so the photo's blacks rise to the site's plum while highlights
                  barely move (parchment gains ~1/255). Harmless over the empty
                  fallback frame too. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{ background: "var(--ink)" }}
              />
            </div>
          </div>
        </Reveal>
        <div className={reversed ? "md:order-1" : ""}>
          <Reveal variant="up" {...MOTION.section.eyebrow}>
            <div className="font-mono font-semibold text-fluid-10 uppercase tracking-[0.2em] text-[color:var(--ink-3)] mb-3">
              {person.half}
            </div>
          </Reveal>
          <Reveal variant="up" {...MOTION.section.headline}>
            <h3 className="font-serif-display text-[clamp(28px,2.6vw,42px)] leading-[1.05] text-[color:var(--ink)] m-0">
              {person.name}
            </h3>
          </Reveal>
          {person.line && (
            <Reveal variant="up" {...MOTION.section.body}>
              <p className="font-editorial italic text-[clamp(17px,1.5vw,21px)] leading-[1.35] text-[color:var(--ink-2)] mt-3 mb-0">
                {person.line}
              </p>
            </Reveal>
          )}
          <div className="mt-6 flex flex-col gap-4">
            {person.story.map((p, i) => (
              <Reveal
                key={i}
                variant="up"
                duration={MOTION.duration.base}
                delay={MOTION.section.body.delay + (i + 1) * MOTION.stagger.body}
              >
                <p className="font-mono text-fluid-15 leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-[44ch] m-0">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

const About = () => {
  usePageTitle("about");
  const c = copy.about;
  // Optional copy: the second message paragraph. An absent key hides its
  // block, nothing more — the same contract Fiction's optional sections use,
  // so the owner can add or drop it in copy.ts without touching this file.
  const extras = c as typeof c & { paragraph?: string };
  return (
    // ends on the tan contact band, so the plum wedge would collide with it
    <SiteLayout plum={false}>
      {/* ---------- headline (markup unchanged — an ink smudge is anchored
          to this box and placed against its proportions) ---------- */}
      <section data-ink-anchor="About headline" className="relative px-[3.2vw] pt-[84px] pb-14">
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
              style={{ fontWeight: 420 }}
            >
              {c.headlineLine2}
            </span>
          </Reveal>
        </h1>
      </section>

      {/* ---------- the message: two paragraphs, lede then body ---------- */}
      <section data-ink-anchor="About intro" className="px-[3.2vw] pt-12 pb-[88px] rule-top-fade">
        <div className="md:ml-[8vw] max-w-[760px]">
          <Reveal variant="up" duration={MOTION.duration.base}>
            <p
              className="font-editorial italic text-[clamp(19px,2.1vw,28px)] leading-[1.45] text-[color:var(--ink-2)] m-0"
              style={{ fontWeight: 420 }}
            >
              {c.lede}
            </p>
          </Reveal>
          {extras.paragraph && (
            <Reveal variant="up" duration={MOTION.duration.base} delay={MOTION.stagger.body}>
              <p className="font-mono text-fluid-15.5 leading-[1.75] tracking-[0.015em] text-[color:var(--ink-2)] max-w-measure mt-7 mb-0">
                {extras.paragraph}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------- the two of us: portraits on the tan ground ---------- */}
      <div
        data-ink-anchor="About team"
        className="relative diag-band"
        style={{
          background: "var(--tan)",
          paddingTop: "calc(3vw + 56px)",
          paddingBottom: "calc(3vw + 40px)",
        }}
      >
        <div className="px-[3.2vw]">
          <Reveal variant="up" {...MOTION.section.eyebrow}>
            <div className="flex items-center gap-6">
              <h2 className="font-serif-display text-[clamp(34px,3.2vw,58px)] tracking-[-0.01em] text-[color:var(--ink)] m-0">
                {c.teamHeadline}
              </h2>
              {/* the hairline runs from the headline's optical middle, the
                  homepage's "The plugins" gesture on the tan ground */}
              <div
                className="flex-1 h-px mt-[10px]"
                style={{ background: "var(--divider-fade)" }}
              />
            </div>
          </Reveal>
        </div>
        <div className="mt-4">
          {c.team.map((person, i) => (
            <TeamRow key={person.name} person={person} index={i} />
          ))}
        </div>
      </div>

      {/* ---------- the summation: the message, signed ---------- */}
      <section data-ink-anchor="About summation" className="px-[3.2vw] pt-[72px] pb-[96px]">
        <div className="md:ml-[8vw] max-w-[900px]">
          <Reveal variant="draw" duration={MOTION.duration.draw}>
            <div
              className="h-0.5 bg-[color:var(--accent-raw)]"
              style={{ width: "clamp(40px,3.6vw,68px)", marginBottom: "26px" }}
            />
          </Reveal>
          <Reveal variant="up" {...MOTION.section.headline}>
            <p className="font-serif-display text-[clamp(30px,4.4vw,62px)] leading-[1.08] tracking-[-0.01em] text-[color:var(--ink)] m-0">
              {c.visionLine}
            </p>
          </Reveal>
          <Reveal variant="up" {...MOTION.section.body}>
            <p className="font-editorial italic text-[clamp(17px,1.7vw,23px)] leading-[1.5] text-[color:var(--ink-2)] max-w-[52ch] mt-7 mb-0">
              {c.summation}
            </p>
          </Reveal>
          <Reveal
            variant="up"
            duration={MOTION.duration.base}
            delay={MOTION.section.body.delay + MOTION.stagger.body}
          >
            <p className="font-editorial italic text-fluid-17 text-[color:var(--ink)] mt-6 mb-0">
              {c.signoff}
            </p>
          </Reveal>
          <Reveal
            variant="up"
            duration={MOTION.duration.base}
            delay={MOTION.section.body.delay + 2 * MOTION.stagger.body}
          >
            <div className="mt-10">
              <Link to="/#plugins" className="link-ink">
                <span>{c.summationCta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- contact: the tan ground (markup unchanged — a worked ink
          mark is anchored here) ---------- */}
      <div
        data-ink-anchor="Contact"
        className="relative diag-band"
        style={{
          background: "var(--tan)",
          paddingTop: "calc(3vw + 64px)",
          paddingBottom: "calc(3vw + 96px)",
        }}
      >
        <LabelledSection label={c.contactEyebrow} labelTone="copper" labelPad="14px">
          <Reveal variant="up" {...MOTION.section.headline}>
            <MagneticLink
              as="a"
              href={`mailto:${copy.contactEmail}`}
              strength={6}
              className="inline-block font-editorial italic text-[clamp(24px,3vw,36px)] leading-[1.2] text-[color:var(--ink)] border-b border-[color:var(--ink-line-2)] pb-1 transition-colors duration-[200ms] ease-editorial hover:text-[color:var(--accent-deep)] hover:border-[color:var(--accent-deep)]"
            >
              {copy.contactEmail}
            </MagneticLink>
            <p className="font-mono text-fluid-12 tracking-[0.04em] text-[color:var(--ink-3)] mt-5 mb-0">
              {c.contactSubline}
            </p>
          </Reveal>
        </LabelledSection>
      </div>
    </SiteLayout>
  );
};

export default About;
