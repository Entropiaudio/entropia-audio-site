import { useParams, Navigate, useNavigate } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import PluginScreenshot from "@/components/PluginScreenshot";
import AudioDemo from "@/components/AudioDemo";
import Section from "@/components/primitives/Section";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { getPlugin } from "@/data/plugins";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { copy } from "@/copy";

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
        <div className="max-w-wide mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <span className="text-[12px] font-mono uppercase tracking-[0.22em] text-[color:var(--text-primary)]">
            {plugin.name}
          </span>
          <div className="flex items-baseline gap-8">
            <a
              href="#try"
              className="text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial"
            >
              {c.ctaTry}
            </a>
            <button
              type="button"
              onClick={() => addToCart("perpetual", true)}
              className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[400ms] ease-editorial tabular-nums"
            >
              <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[400ms] ease-editorial">
                {c.ctaBuy} · ${plugin.price}
              </span>
              {onSale && (
                <span className="line-through text-[11px] text-[color:var(--text-tertiary)]">
                  ${plugin.regularPrice}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- product hero ---------- */}
      <Section pad="lg">
        <Container width="wide">
          <div className="md:pl-8 lg:pl-16">
            <Eyebrow className="mb-12">
              // {plugin.name} · v{plugin.version}
            </Eyebrow>
            <div className="max-w-[1080px]">
              <PluginScreenshot
                name={plugin.name}
                ratio="hero"
                src={plugin.screenshot}
                fit="contain"
                alt={`${plugin.name} plugin interface`}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- name + tagline ---------- */}
      <Section pad="lg">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{plugin.name}</Eyebrow>
            </div>
            <div className="md:col-span-8">
              <h1 className="font-display font-light leading-[1.0] tracking-[-0.02em] text-[44px] md:text-[64px] lg:text-[80px]">
                <span className="font-editorial italic font-normal tracking-[-0.015em]">
                  {plugin.tagline}
                </span>
              </h1>
              <p className="mt-10 font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[58ch]">
                {plugin.shortDescription}
              </p>

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
                <li
                  key={i}
                  className="grid grid-cols-[3rem,1fr] gap-6 md:gap-10 font-sans font-normal text-[17px] md:text-[18px] leading-[1.65] tracking-[0.005em] border-t border-hairline py-7"
                >
                  <span className="font-mono text-[12px] tabular-nums text-[color:var(--text-tertiary)] pt-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[color:var(--text-primary)]">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---------- alternating image / text ---------- */}
      <Container width="wide">
        {plugin.sections.map((section, i) => {
          const reversed = i % 2 === 1;
          return (
            <article
              key={i}
              className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center py-24 md:py-32 border-t border-hairline ${
                reversed ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className={`md:col-span-6 ${reversed ? "md:col-start-7" : ""}`}>
                <PluginScreenshot
                  name={plugin.name}
                  ratio="wide"
                  bare
                  src={plugin.screenshot}
                  fit="contain"
                  alt={`${plugin.name} ${section.heading}`}
                />
              </div>
              <div className={`md:col-span-5 ${reversed ? "md:col-start-2" : "md:col-start-8"}`}>
                <Eyebrow className="mb-6">
                  {String(i + 1).padStart(2, "0")} / {plugin.sections.length.toString().padStart(2, "0")}
                </Eyebrow>
                <h3 className="font-display font-light text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em] mb-8">
                  {section.heading}
                </h3>
                <p className="font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[42ch]">
                  {section.body}
                </p>
              </div>
            </article>
          );
        })}
      </Container>

      {/* ---------- audio demos ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{c.listenEyebrow}</Eyebrow>
            </div>
            <div className="md:col-span-8">
              <h3 className="font-display font-light text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em] mb-14">
                <span className="font-editorial italic font-normal tracking-[-0.015em]">
                  {c.listenHeadline}
                </span>
              </h3>
              <div>
                {plugin.demos.map((d, i) => (
                  <AudioDemo key={d.slug} demo={d} index={i} />
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
            <div className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{c.specsEyebrow}</Eyebrow>
            </div>
            <div className="md:col-span-8">
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
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- try / download ---------- */}
      <Section pad="lg" tone="rule-top">
        <Container width="wide" id="try">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-3 md:col-start-2 md:pt-4">
              <Eyebrow>{c.tryEyebrow}</Eyebrow>
            </div>
            <div className="md:col-span-8">
              <h3 className="font-display font-light text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em] mb-8">
                <span className="font-editorial italic font-normal tracking-[-0.015em]">
                  {c.tryHeadline}
                </span>
              </h3>
              <p className="font-sans font-normal text-[17px] md:text-[18px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[52ch] mb-12">
                {c.trySubline}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <a
                  href="#"
                  className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
                >
                  <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                    {c.downloadMac}
                  </span>
                  <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">↓</span>
                </a>
                <a
                  href="#"
                  className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
                >
                  <span className="border-b border-[color:var(--text-primary)] group-hover:border-[color:var(--accent-raw)] pb-1 transition-colors duration-[600ms] ease-editorial">
                    {c.downloadWin}
                  </span>
                  <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">↓</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </SiteLayout>
  );
};

export default PluginPage;
