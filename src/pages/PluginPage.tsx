import { useParams, Navigate, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import PluginScreenshot from "@/components/PluginScreenshot";
import AudioDemo from "@/components/AudioDemo";
import { getPlugin } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

const PluginPage = () => {
  const { slug } = useParams();
  const plugin = slug ? getPlugin(slug) : undefined;
  const { add } = useCart();
  const navigate = useNavigate();

  if (!plugin) return <Navigate to="/" replace />;

  const onSale = plugin.regularPrice > plugin.price;

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
      {/* sticky CTA */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-sm border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-12 flex items-center justify-between">
          <span className="text-sm font-mono uppercase tracking-widest text-foreground/55">
            {plugin.name}
          </span>
          <div className="flex items-center gap-2">
            <a
              href="#try"
              className="text-xs md:text-sm px-4 py-2 border border-foreground/20 hover:border-foreground transition-colors"
            >
              try free
            </a>
            <button
              type="button"
              onClick={() => addToCart("perpetual", true)}
              className="text-xs md:text-sm px-4 py-2 bg-foreground text-background hover:bg-accent transition-colors inline-flex items-baseline gap-2"
            >
              <span>buy · ${plugin.price}</span>
              {onSale && (
                <span className="line-through opacity-60 text-[11px] tabular-nums">
                  ${plugin.regularPrice}
                </span>
              )}
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

      {/* hero screenshot — full bleed within content max */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-6">
          // {plugin.name} · v{plugin.version}
        </div>
        <PluginScreenshot name={plugin.name} ratio="hero" />
      </section>

      {/* name + tagline */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-8 text-center">
        <h1 className="text-sm md:text-base font-mono uppercase tracking-[0.4em] text-foreground/50">
          {plugin.name}
        </h1>
        <p className="mt-6 text-4xl md:text-6xl font-display tracking-tight-display leading-[1.05]">
          {plugin.tagline}
        </p>
        <p className="mt-8 text-lg md:text-xl text-foreground/65 leading-relaxed measure mx-auto">
          {plugin.shortDescription}
        </p>

        <div className="mt-10 flex items-baseline justify-center gap-4 font-mono text-sm">
          <span className="text-foreground text-base">${plugin.price}</span>
          {onSale && (
            <>
              <span className="line-through text-foreground/35">${plugin.regularPrice}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
                launch sale
              </span>
            </>
          )}
        </div>
      </section>

      {/* numbered features */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <ul className="space-y-6 md:space-y-7">
          {plugin.features.map((f, i) => (
            <li
              key={i}
              className="grid grid-cols-[2.5rem,1fr] gap-4 md:gap-6 text-base md:text-lg leading-relaxed border-t border-hairline pt-5"
            >
              <span className="font-mono text-xs text-foreground/45 pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* alternating image/text sections */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {plugin.sections.map((section, i) => {
          const reversed = i % 2 === 1;
          return (
            <section
              key={i}
              className={`grid md:grid-cols-2 gap-10 md:gap-20 items-center py-20 md:py-32 border-t border-hairline ${
                reversed ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <PluginScreenshot name={plugin.name} ratio="square" bare />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-5">
                  {String(i + 1).padStart(2, "0")} / {plugin.sections.length.toString().padStart(2, "0")}
                </div>
                <h3 className="text-3xl md:text-4xl font-display tracking-tight-display leading-tight mb-6">
                  {section.heading}
                </h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed measure">
                  {section.body}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      {/* audio demos */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-hairline">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-3">
          listen
        </div>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight-display mb-12">
          a few things it can do.
        </h3>
        <div>
          {plugin.demos.map((d, i) => (
            <AudioDemo key={d.slug} demo={d} index={i} />
          ))}
        </div>
      </section>

      {/* tech specs */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-hairline">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-8">
          specifications
        </div>
        <table className="w-full text-base">
          <tbody>
            {plugin.specs.map((spec) => (
              <tr key={spec.label} className="border-t border-hairline">
                <td className="py-5 pr-6 text-foreground/55 w-1/3 align-top">
                  {spec.label}
                </td>
                <td className="py-5 font-mono text-sm">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* download */}
      <section
        id="try"
        className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-hairline"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-3">
          try
        </div>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight-display mb-6">
          the real plugin, free for seven days.
        </h3>
        <p className="text-base md:text-lg text-foreground/65 leading-relaxed measure mb-10">
          no noise, no silence — the full thing. enter a license key when you're ready, or don't.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <a
            href="#"
            className="text-sm px-6 py-4 border border-foreground hover:bg-foreground hover:text-background transition-colors text-center"
          >
            download for macOS
          </a>
          <a
            href="#"
            className="text-sm px-6 py-4 border border-foreground hover:bg-foreground hover:text-background transition-colors text-center"
          >
            download for Windows
          </a>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PluginPage;
