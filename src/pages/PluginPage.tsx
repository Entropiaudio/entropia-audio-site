import { useParams, Navigate, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import PluginScreenshot from "@/components/PluginScreenshot";
import { getPlugin } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

const PluginPage = () => {
  const { slug } = useParams();
  const plugin = slug ? getPlugin(slug) : undefined;
  const { add } = useCart();
  const navigate = useNavigate();

  if (!plugin) return <Navigate to="/" replace />;

  const addToCart = (license: "perpetual" | "rent-to-own", goToCart = false) => {
    add({ slug: plugin.slug, name: plugin.name, price: plugin.price, license });
    if (goToCart) {
      navigate("/cart");
    } else {
      toast({ title: `${plugin.name} added to cart.`, description: license });
    }
  };

  return (
    <SiteLayout>
      {/* sticky sub-header with CTAs */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-sm border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-12 flex items-center justify-between">
          <span className="text-sm text-foreground/60">{plugin.name}</span>
          <div className="flex items-center gap-2">
            <a
              href="#try"
              className="text-xs md:text-sm px-4 py-2 border border-foreground/20 hover:border-foreground transition-colors"
            >
              try
            </a>
            <button
              type="button"
              onClick={() => addToCart("perpetual", true)}
              className="text-xs md:text-sm px-4 py-2 bg-foreground text-background hover:bg-accent transition-colors"
            >
              buy · ${plugin.price}
            </button>
            <button
              type="button"
              onClick={() => addToCart("rent-to-own")}
              className="hidden sm:inline-block text-xs md:text-sm px-4 py-2 border border-foreground/20 hover:border-foreground transition-colors"
            >
              rent-to-own
            </button>
          </div>
        </div>
      </div>

      {/* hero screenshot */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-20 md:pt-28">
        <PluginScreenshot name={plugin.name} />
      </section>

      {/* name + tagline */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground/60">
          {plugin.name}
        </h1>
        <p className="mt-4 text-3xl md:text-5xl font-medium tracking-tight">
          {plugin.tagline}
        </p>
      </section>

      {/* feature bullets */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <ul className="space-y-4">
          {plugin.features.map((f, i) => (
            <li key={i} className="flex gap-4 text-base md:text-lg leading-relaxed">
              <span className="font-mono text-xs text-accent pt-2 shrink-0 w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* alternating feature sections */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {plugin.sections.map((section, i) => {
          const reversed = i % 2 === 1;
          return (
            <section
              key={i}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-24 border-t border-hairline ${
                reversed ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <PluginScreenshot name={plugin.name} ratio="square" />
              <div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-5">
                  {section.heading}
                </h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  {section.body}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      {/* tech specs */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24 border-t border-hairline">
        <h3 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-8">
          technical specifications
        </h3>
        <table className="w-full text-base">
          <tbody>
            {plugin.specs.map((spec) => (
              <tr key={spec.label} className="border-t border-hairline">
                <td className="py-4 pr-6 text-foreground/60 w-1/3">
                  {spec.label}
                </td>
                <td className="py-4 font-mono text-sm">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* download */}
      <section
        id="try"
        className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24 border-t border-hairline"
      >
        <h3 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-8">
          download
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-base">
          <a href="#" className="underline underline-offset-4 hover:text-accent transition-colors">
            download for macOS
          </a>
          <a href="#" className="underline underline-offset-4 hover:text-accent transition-colors">
            download for Windows
          </a>
        </div>
        <p className="text-sm text-foreground/50 mt-6">
          includes a fully featured 14-day trial.
        </p>
      </section>
    </SiteLayout>
  );
};

export default PluginPage;
