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
import { Moonbase } from "@/lib/moonbase";

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
    <article className="relative grid md:grid-cols-12 gap-10 md:gap-16 items-center py-24 md:py-32 rule-top-fade first:before:hidden">
      <Reveal
        variant="up"
        {...MOTION.section.image}
        className="block md:col-span-7"
      >
        <Link
          to={`/plugins/${plugin.slug}`}
          aria-label={`open ${plugin.name}`}
          className="block hover-zoom group transition-transform duration-[200ms] ease-editorial hover:-translate-y-0.5"
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
            <h2 className="font-display text-[48px] md:text-[60px] leading-[0.95] text-[color:var(--ink)]">
              {plugin.name}
            </h2>
            <p className="mt-4 font-editorial italic text-[20px] md:text-[22px] leading-[1.35] text-[color:var(--ink-2)]">
              {plugin.tagline}
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" {...MOTION.section.headline}>
          <p className="font-sans font-normal text-[16px] md:text-[17px] leading-[1.7] tracking-[0.005em] text-[color:var(--ink-2)] max-w-[42ch]">
            {plugin.shortDescription}
          </p>
        </Reveal>

        <Reveal variant="up" {...MOTION.section.body}>
          <div key={pricing.price} className="state-fade flex items-baseline gap-4 font-mono font-semibold text-[19px] tabular-nums">
            <span className="text-[color:var(--ink)]">${pricing.price}</span>
            {onSale && (
              <>
                <span className="line-through font-normal text-[15px] text-[color:var(--ink-3)]">${pricing.regularPrice}</span>
                <span className="text-[11px] uppercase tracking-label text-[color:var(--pop)]">
                  {cv.saleBadge}
                </span>
              </>
            )}
          </div>
        </Reveal>

        <Reveal variant="up" {...MOTION.section.cta}>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticLink
              to={`/plugins/${plugin.slug}`}
              strength={6}
              className="btn btn-solid"
            >
              <span>{c.primaryButton}</span>
              <span aria-hidden="true" className="transition-transform duration-[200ms] ease-editorial group-hover:translate-x-1">→</span>
            </MagneticLink>
            <button
              type="button"
              onClick={() => Moonbase.download_product({ product_id: plugin.slug })}
              className="btn btn-ghost"
            >
              {c.secondaryButton}
            </button>
          </div>
        </Reveal>
      </div>
    </article>
  );
};

export default ProductRow;
