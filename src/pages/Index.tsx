import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import ProductRow from "@/components/ProductRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import { plugins } from "@/data/plugins";

const Index = () => {
  return (
    <SiteLayout>
      {/* hero — about Entropia, not Chaosverb */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-32 md:pt-48 pb-24 md:pb-32">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-8">
          // entropia audio
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tightest leading-[0.98] max-w-4xl">
          audio tools,
          <br />
          <span className="font-display-italic text-foreground/70">built by two nerds who care.</span>
        </h1>
        <p className="mt-10 md:mt-14 text-xl md:text-2xl text-foreground/65 leading-relaxed measure">
          a small studio making serious plugins. the kind that sit well on a mix bus, and the kind that pull a held note somewhere it wasn't going.
        </p>
      </section>

      {/* featured product */}
      <section className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-3 pt-4 border-t border-hairline">
          featured
        </div>
        {plugins.map((p) => (
          <ProductRow key={p.slug} plugin={p} />
        ))}
      </section>

      {/* about strip */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-hairline">
        <div className="grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20 items-start">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 md:pt-3">
            about
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-display tracking-tight-display leading-snug text-foreground/85">
              we're two friends who love this — the dsp, the knobs, the way a reverb tail decays just right. small studio, no committee, no filler. if you have feedback, it lands in our inbox.
            </p>
            <Link
              to="/about"
              className="inline-block mt-8 text-sm font-mono uppercase tracking-widest border-b border-foreground/40 hover:border-foreground hover:text-accent pb-1 transition-colors"
            >
              more on us →
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </SiteLayout>
  );
};

export default Index;
