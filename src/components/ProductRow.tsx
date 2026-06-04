import { Link } from "react-router-dom";
import PluginScreenshot from "./PluginScreenshot";
import Eyebrow from "./primitives/Eyebrow";
import Reveal from "./motion/Reveal";
import MagneticLink from "./motion/MagneticLink";
import { MOTION } from "./motion/timing";
import { useParallax } from "@/hooks/useScrollMotion";
import { usePluginPricing } from "@/hooks/usePluginPricing";
import type { Plugin } from "@/data/plugins";
import { copy } from "@/copy";
import { Moonbase, isMoonbaseEnabled } from "@/lib/moonbase";

const ProductRow = ({ plugin }: { plugin: Plugin }) => {
  const c = copy.productRow;
  const cv = copy.chaosverb;
  const pricing = usePluginPricing(plugin.slug, {
    price: plugin.price,
    regularPrice: plugin.regularPrice,
  });
  const onSale = pricing.regularPrice > pricing.price;
  const parallaxRef = useParallax<HTMLDivElement>(36);

  return (
    <article className="relative grid md:grid-cols-12 gap-10 md:gap-16 items-center py-24 md:py-32 border-t border-hairline first:border-t-0">
      <Reveal
        variant="up"
        {...MOTION.section.image}
        className="block md:col-span-7"
      >
        <Link
          to={`/plugins/${plugin.slug}`}
          aria-label={`open ${plugin.name}`}
          className="block hover-zoom group"
        >
          <div ref={parallaxRef}>
            <PluginScreenshot
              name={plugin.name}
              ratio="wide"
              src={plugin.screenshot}
              fit="contain"
              alt={`${plugin.name} plugin interface`}
            />
          </div>
        </Link>
      </Reveal>

      <div className="md:col-span-4 md:col-start-9 flex flex-col gap-8">
        <Reveal variant="up" {...MOTION.section.eyebrow}>
          <div>
            <Eyebrow className="mb-5">{c.eyebrow}</Eyebrow>
            <h2 className="font-display font-light text-[44px] md:text-[56px] leading-[1.0] tracking-[-0.02em] normal-case">
              {plugin.name}
            </h2>
            <p className="mt-5 font-editorial italic text-[20px] md:text-[22px] leading-[1.35] text-[color:var(--text-secondary)]">
              {plugin.tagline}
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" {...MOTION.section.headline}>
          <p className="font-sans font-normal text-[16px] md:text-[17px] leading-[1.7] tracking-[0.005em] text-[color:var(--text-secondary)] max-w-[42ch]">
            {plugin.shortDescription}
          </p>
        </Reveal>

        <Reveal variant="up" {...MOTION.section.body}>
          <div className="flex items-baseline gap-4 font-mono text-[13px] tabular-nums">
            <span className="text-[color:var(--text-primary)]">${pricing.price}</span>
            {onSale && (
              <>
                <span className="line-through text-[color:var(--text-tertiary)]">${pricing.regularPrice}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent-raw)]">
                  {cv.saleBadge}
                </span>
              </>
            )}
          </div>
        </Reveal>

        <Reveal variant="up" {...MOTION.section.cta}>
          <div className="flex items-baseline gap-8 pt-2">
            <MagneticLink
              to={`/plugins/${plugin.slug}`}
              strength={6}
              className="group inline-flex items-baseline gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-primary)] hover:text-[color:var(--accent-raw)] transition-colors duration-[600ms] ease-editorial"
            >
              <span className="link-draw pb-1">
                {c.primaryButton}
              </span>
              <span className="transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">→</span>
            </MagneticLink>
            {isMoonbaseEnabled ? (
              <button
                type="button"
                onClick={() => Moonbase.download_product({ product_id: plugin.slug })}
                className="link-draw text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[600ms] ease-editorial"
              >
                {c.secondaryButton}
              </button>
            ) : (
              <Link
                to={`/plugins/${plugin.slug}#try`}
                className="link-draw text-[13px] font-mono uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[600ms] ease-editorial"
              >
                {c.secondaryButton}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
};

export default ProductRow;
