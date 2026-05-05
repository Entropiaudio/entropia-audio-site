import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import ProductRow from "@/components/ProductRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import { plugins } from "@/data/plugins";
import { copy } from "@/copy";

const Index = () => {
  const c = copy.home;
  return (
    <SiteLayout>
      {/* hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-32 md:pt-48 pb-24 md:pb-32">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-8">
          {c.eyebrow}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tightest leading-[0.98] max-w-4xl">
          {c.headlineLine1}
          <br />
          <span className="font-display-italic text-foreground/70">
            {c.headlineLine2}
          </span>
        </h1>
        <p className="mt-10 md:mt-14 text-xl md:text-2xl text-foreground/65 leading-relaxed measure">
          {c.subline}
        </p>
      </section>

      {/* featured product */}
      <section className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-3 pt-4 border-t border-hairline">
          {c.featuredEyebrow}
        </div>
        {plugins.map((p) => (
          <ProductRow key={p.slug} plugin={p} />
        ))}
      </section>

      {/* about strip */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-hairline">
        <div className="grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20 items-start">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 md:pt-3">
            {c.aboutEyebrow}
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display tracking-tight-display leading-snug text-foreground/85">
              {c.aboutBlurb}
            </p>
            <Link
              to="/about"
              className="inline-block mt-8 text-sm font-mono uppercase tracking-widest border-b border-foreground/40 hover:border-foreground hover:text-accent pb-1 transition-colors"
            >
              {c.aboutLink} →
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </SiteLayout>
  );
};

export default Index;
