import SiteLayout from "@/components/SiteLayout";
import { copy } from "@/copy";

const About = () => {
  const c = copy.about;
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-28 md:pt-40 pb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-8">
          {c.eyebrow}
        </div>
        <h1 className="text-5xl md:text-7xl font-display tracking-tightest leading-[0.98]">
          {c.headlineLine1}
          <br />
          <span className="font-display-italic text-foreground/70">{c.headlineLine2}</span>
        </h1>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 grid md:grid-cols-[1fr,1.2fr] gap-12 md:gap-20 items-start py-16 md:py-24">
        <figure className="aspect-[4/5] w-full relative" aria-label="portrait of the entropia audio team">
          <div className="absolute inset-0 border border-foreground/15" />
          <div className="absolute inset-[1px] bg-foreground/[0.04] flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              {c.portraitPlaceholder}
            </span>
          </div>
        </figure>

        <div className="space-y-7 text-lg md:text-xl text-foreground/75 leading-relaxed measure">
          <p>{c.paragraph1}</p>
          <p>{c.paragraph2}</p>
          <p>{c.paragraph3}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-hairline">
        <div className="grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20 items-start">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 md:pt-2">
            {c.contactEyebrow}
          </div>
          <div>
            <a
              href={`mailto:${copy.contactEmail}`}
              className="text-2xl md:text-3xl font-display tracking-tight-display border-b border-foreground/30 hover:border-foreground hover:text-accent transition-colors pb-1 inline-block"
            >
              {copy.contactEmail}
            </a>
            <p className="text-sm text-foreground/55 mt-4 leading-relaxed">
              {c.contactSubline}
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
