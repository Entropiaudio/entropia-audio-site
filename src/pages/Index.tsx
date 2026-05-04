import SiteLayout from "@/components/SiteLayout";
import ProductRow from "@/components/ProductRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import { plugins } from "@/data/plugins";

const Index = () => {
  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-24 md:pt-40 pb-16 md:pb-24">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight max-w-3xl">
          audio tools built with intent.
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10">
        {plugins.map((p) => (
          <ProductRow key={p.slug} plugin={p} />
        ))}
      </section>

      <NewsletterSignup />
    </SiteLayout>
  );
};

export default Index;
