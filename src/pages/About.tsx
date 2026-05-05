import SiteLayout from "@/components/SiteLayout";

const About = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-28 md:pt-40 pb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-8">
          // about
        </div>
        <h1 className="text-5xl md:text-7xl font-display tracking-tightest leading-[0.98]">
          two friends,
          <br />
          <span className="font-display-italic text-foreground/70">a few good plugins.</span>
        </h1>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 grid md:grid-cols-[1fr,1.2fr] gap-12 md:gap-20 items-start py-16 md:py-24">
        {/* portrait placeholder */}
        <figure className="aspect-[4/5] w-full relative" aria-label="portrait of the entropia audio team">
          <div className="absolute inset-0 border border-foreground/15" />
          <div className="absolute inset-[1px] bg-foreground/[0.04] flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              portrait goes here
            </span>
          </div>
        </figure>

        <div className="space-y-7 text-lg md:text-xl text-foreground/75 leading-relaxed measure">
          <p>
            entropia audio is a studio of two. we love this: the dsp, the knobs, the way a reverb tail decays just right. we started building plugins because we wanted to make the tools we wished existed, and because there's something honest about shipping a small thing well.
          </p>
          <p>
            we care about three things, in this order: how it sounds, how it feels to use, how it looks when you open it. we tune knobs by ear. we sweat the typography. we'd rather sit on a release for another week than ship something we don't love.
          </p>
          <p>
            no committee, no filler, no marketing department. if you have feedback (a bug, a feature, a sound you wish the plugin could make), write to us. it lands in our inbox.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-hairline">
        <div className="grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20 items-start">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 md:pt-2">
            contact
          </div>
          <div>
            <a
              href="mailto:entropia.audio@gmail.com"
              className="text-2xl md:text-3xl font-display tracking-tight-display border-b border-foreground/30 hover:border-foreground hover:text-accent transition-colors pb-1 inline-block"
            >
              entropia.audio@gmail.com
            </a>
            <p className="text-sm text-foreground/55 mt-4 leading-relaxed">
              a real inbox. we read everything. we mostly reply.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
